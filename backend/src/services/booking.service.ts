import { DateTime } from "luxon";
import { env } from "../config/env.js";
import { supabaseAdmin } from "./supabase.service.js";
import type { BookingPayload } from "../types/booking.types.js";
import { getAvailabilityWindow, listBusinessHours } from "./availability.service.js";

export function parseAppointmentStart(date: string, time: string): string {
  const start = DateTime.fromFormat(`${date} ${time}`, "yyyy-MM-dd h:mm a", {
    zone: env.businessTimezone,
  });

  if (!start.isValid) throw new Error("VALIDATION_ERROR: Invalid appointment date or time");
  return start.toUTC().toISO() as string;
}

export function durationForTier(tier: BookingPayload["designTier"]): number {
  return tier ? 120 + (tier - 1) * 30 : 120;
}

// Appointments start the day after the request, so today and anything earlier
// is not bookable. The calendar hides those days; this keeps a direct API call
// from getting around it.
export function isBookableDate(date: string): boolean {
  const day = DateTime.fromISO(date, { zone: env.businessTimezone }).startOf("day");
  if (!day.isValid) return false;
  return day > DateTime.now().setZone(env.businessTimezone).startOf("day");
}

const HOLD_DAYS = 3;

export async function createHeldBooking(payload: BookingPayload) {
  await expireStaleBookings();
  if (!isBookableDate(payload.date)) {
    throw new Error("VALIDATION_ERROR: Appointments must be booked at least one day in advance.");
  }
  const appointmentStart = parseAppointmentStart(payload.date, payload.time);
  // An unanswered request holds its slot for 3 days, but never past the
  // appointment itself.
  const holdExpiresAt = Math.min(Date.now() + HOLD_DAYS * 24 * 60 * 60 * 1000, new Date(appointmentStart).getTime());
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      status: "held",
      hold_expires_at: new Date(holdExpiresAt).toISOString(),
      appointment_start: appointmentStart,
      duration_minutes: durationForTier(payload.designTier),
      service_type: payload.serviceType,
      service: payload.service,
      nail_length: payload.nailLength,
      nail_shape: payload.nailShape,
      design_tier: payload.designTier,
      extras: payload.extras,
      contact: payload.contact,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function expireStaleBookings() {
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ status: "expired" })
    .eq("status", "held")
    .lte("hold_expires_at", new Date().toISOString());

  if (error) throw error;
}

export async function listHeldBookings() {
  await expireStaleBookings();
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("status", "held")
    .gt("hold_expires_at", new Date().toISOString())
    .order("appointment_start", { ascending: true });

  if (error) throw error;
  return data;
}

export async function listBookingHistory() {
  await expireStaleBookings();
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .in("status", ["confirmed", "declined", "cancelled", "expired"])
    .order("appointment_start", { ascending: true });

  if (error) throw error;
  return data;
}

export async function listAvailableSlots(date: string, durationMinutes: number) {
  await expireStaleBookings();
  const dayStart = DateTime.fromISO(date, { zone: env.businessTimezone }).startOf("day");
  if (!dayStart.isValid) throw new Error("VALIDATION_ERROR: Invalid availability date");
  const window = await getAvailabilityWindow(date);
  if (!window) return { slots: [], openTime: null, closeTime: null, isOpen: false, blockedReasons: [] };
  if (!isBookableDate(date)) {
    return {
      slots: [],
      openTime: window.open.toFormat("h:mm a"),
      closeTime: window.close.toFormat("h:mm a"),
      isOpen: true,
      blockedReasons: ["Same-day booking is not available."],
    };
  }
  const dayEnd = dayStart.plus({ days: 1 });
  const { data: blocked, error: blockedError } = await supabaseAdmin
    .from("blocked_periods")
    .select("starts_at, ends_at, reason")
    .lt("starts_at", dayEnd.toUTC().toISO())
    .gt("ends_at", dayStart.toUTC().toISO());
  if (blockedError) throw blockedError;
  const blockedPeriods = blocked ?? [];
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("appointment_start, duration_minutes")
    .in("status", ["held", "confirmed"])
    .lt("appointment_start", dayEnd.toUTC().toISO())
    .gte("appointment_start", dayStart.minus({ hours: 4 }).toUTC().toISO());
  if (error) throw error;

  const openMinutes = window.open.diff(dayStart, "minutes").minutes;
  const endMinutes = window.close.diff(dayStart, "minutes").minutes;
  const slots: string[] = [];
  for (let minutes = openMinutes; minutes <= endMinutes; minutes += 30) {
    const candidateStart = dayStart.plus({ minutes });
    const candidateEnd = candidateStart.plus({ minutes: durationMinutes });
    const overlapsBooking = (data ?? []).some((booking) => {
      const existingStart = DateTime.fromISO(booking.appointment_start).toMillis();
      const existingEnd = existingStart + booking.duration_minutes * 60_000;
      return candidateStart.toMillis() < existingEnd && candidateEnd.toMillis() > existingStart;
    });
    if (overlapsBooking) continue;
    const overlapsBlockedPeriod = blockedPeriods.some((period) =>
      candidateStart.toMillis() < DateTime.fromISO(period.ends_at).toMillis()
      && candidateEnd.toMillis() > DateTime.fromISO(period.starts_at).toMillis(),
    );
    if (!overlapsBlockedPeriod) slots.push(candidateStart.toFormat("h:mm a"));
  }
  return {
    slots,
    openTime: window.open.toFormat("h:mm a"),
    closeTime: window.close.toFormat("h:mm a"),
    isOpen: true,
    blockedReasons: blockedPeriods.map((period) => period.reason).filter(Boolean),
  };
}

// Days in a month the calendar should grey out: the studio is closed that
// weekday, or blocked periods cover the whole opening window. A day with only
// part of it blocked stays selectable so its remaining slots can be offered.
export async function listClosedDays(month: string) {
  const monthStart = DateTime.fromISO(`${month}-01`, { zone: env.businessTimezone }).startOf("day");
  if (!monthStart.isValid) throw new Error("VALIDATION_ERROR: Invalid month");
  const monthEnd = monthStart.plus({ months: 1 });
  const hours = await listBusinessHours();
  const { data: blocked, error } = await supabaseAdmin
    .from("blocked_periods")
    .select("starts_at, ends_at")
    .lt("starts_at", monthEnd.toUTC().toISO())
    .gt("ends_at", monthStart.toUTC().toISO());
  if (error) throw error;
  const periods = (blocked ?? [])
    .map((period) => ({ start: DateTime.fromISO(period.starts_at).toMillis(), end: DateTime.fromISO(period.ends_at).toMillis() }))
    .sort((a, b) => a.start - b.start);

  const closed: string[] = [];
  for (let day = monthStart; day < monthEnd; day = day.plus({ days: 1 })) {
    const date = day.toISODate() as string;
    const hour = hours.find((h) => h.day_of_week === day.weekday % 7);
    if (!hour || !hour.is_open || !hour.open_time || !hour.close_time) {
      closed.push(date);
      continue;
    }
    const open = DateTime.fromISO(`${date}T${hour.open_time}`, { zone: env.businessTimezone }).toMillis();
    const close = DateTime.fromISO(`${date}T${hour.close_time}`, { zone: env.businessTimezone }).toMillis();
    let coveredUntil = open;
    for (const period of periods) {
      if (period.start > coveredUntil) break;
      coveredUntil = Math.max(coveredUntil, period.end);
    }
    if (coveredUntil >= close) closed.push(date);
  }
  return closed;
}

export async function acceptBooking(id: string, durationMinutes: number) {
  const { data, error } = await supabaseAdmin.rpc("accept_booking", {
    p_booking_id: id,
    p_duration_minutes: durationMinutes,
  });

  if (error) throw error;
  return data;
}

// The studio can move a pending or confirmed booking to any time between
// 8 AM and 8 PM, outside the regular opening hours if needed. Overlaps with
// other held or confirmed bookings are refused by the database itself.
export async function rescheduleBooking(id: string, date: string, time: string, durationMinutes?: number) {
  const start = DateTime.fromFormat(`${date} ${time}`, "yyyy-MM-dd HH:mm", { zone: env.businessTimezone });
  if (!start.isValid) throw new Error("VALIDATION_ERROR: Invalid date or time");
  if (start <= DateTime.now()) throw new Error("VALIDATION_ERROR: The new time must be in the future.");

  const { data: booking, error: findError } = await supabaseAdmin
    .from("bookings")
    .select("status, hold_expires_at, duration_minutes")
    .eq("id", id)
    .maybeSingle();
  if (findError) throw findError;
  if (!booking) throw new Error("VALIDATION_ERROR: Booking not found.");
  const isActiveHold = booking.status === "held" && DateTime.fromISO(booking.hold_expires_at) > DateTime.now();
  if (!isActiveHold && booking.status !== "confirmed") {
    throw new Error("VALIDATION_ERROR: Only pending or confirmed bookings can be moved.");
  }

  const duration = durationMinutes ?? booking.duration_minutes;
  const end = start.plus({ minutes: duration });
  const earliest = start.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
  const latest = start.set({ hour: 20, minute: 0, second: 0, millisecond: 0 });
  if (start < earliest || end > latest) {
    throw new Error("VALIDATION_ERROR: The appointment has to start at 8 AM or later and finish by 8 PM.");
  }

  const { data: blocked, error: blockedError } = await supabaseAdmin
    .from("blocked_periods")
    .select("id")
    .lt("starts_at", end.toUTC().toISO())
    .gt("ends_at", start.toUTC().toISO())
    .limit(1);
  if (blockedError) throw blockedError;
  if (blocked && blocked.length > 0) {
    throw new Error("VALIDATION_ERROR: That time overlaps a blocked period. Remove the block first if you want to book it.");
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ appointment_start: start.toUTC().toISO(), duration_minutes: duration })
    .eq("id", id)
    .in("status", ["held", "confirmed"])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function declineBooking(id: string) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ status: "declined" })
    .eq("id", id)
    .eq("status", "held")
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelBooking(id: string) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .eq("status", "confirmed")
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBookingHistory(id: string) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .delete()
    .eq("id", id)
    .in("status", ["declined", "cancelled", "expired"])
    .select("id, status")
    .single();

  if (error) throw error;
  return data;
}