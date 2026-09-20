import { DateTime } from "luxon";
import { env } from "../config/env.js";
import { supabaseAdmin } from "./supabase.service.js";
import type { BookingPayload } from "../types/booking.types.js";
import { getAvailabilityWindow } from "./availability.service.js";

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

export async function createHeldBooking(payload: BookingPayload) {
  await expireStaleBookings();
  const appointmentStart = parseAppointmentStart(payload.date, payload.time);
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      status: "held",
      hold_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
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

export async function listAvailableSlots(date: string, durationMinutes: number) {
  await expireStaleBookings();
  const dayStart = DateTime.fromISO(date, { zone: env.businessTimezone }).startOf("day");
  if (!dayStart.isValid) throw new Error("VALIDATION_ERROR: Invalid availability date");
  const window = await getAvailabilityWindow(date);
  if (!window) return { slots: [], openTime: null, closeTime: null, isOpen: false };
  const dayEnd = dayStart.plus({ days: 1 });
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
    const { data: blocked, error: blockedError } = await supabaseAdmin
      .from("blocked_periods")
      .select("starts_at, ends_at")
      .lt("starts_at", candidateEnd.toUTC().toISO())
      .gt("ends_at", candidateStart.toUTC().toISO());
    if (blockedError) throw blockedError;
    if ((blocked ?? []).length === 0) slots.push(candidateStart.toFormat("h:mm a"));
  }
  return {
    slots,
    openTime: window.open.toFormat("h:mm a"),
    closeTime: window.close.toFormat("h:mm a"),
    isOpen: true,
  };
}

export async function acceptBooking(id: string, durationMinutes: number) {
  const { data, error } = await supabaseAdmin.rpc("accept_booking", {
    p_booking_id: id,
    p_duration_minutes: durationMinutes,
  });

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