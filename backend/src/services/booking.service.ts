import { DateTime } from "luxon";
import { env } from "../config/env.js";
import { supabaseAdmin } from "./supabase.service.js";
import type { BookingPayload } from "../types/booking.types.js";

export function parseAppointmentStart(date: string, time: string): string {
  const start = DateTime.fromFormat(`${date} ${time}`, "yyyy-MM-dd h:mm a", {
    zone: env.businessTimezone,
  });

  if (!start.isValid) throw new Error("VALIDATION_ERROR: Invalid appointment date or time");
  return start.toUTC().toISO() as string;
}

export function durationForTier(tier: BookingPayload["designTier"]): number {
  return tier ? 90 + (tier - 1) * 30 : 90;
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