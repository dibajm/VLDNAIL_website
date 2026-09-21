import { DateTime } from "luxon";
import { env } from "../config/env.js";
import { supabaseAdmin } from "./supabase.service.js";
import type { BlockedPeriod, BusinessHour } from "../types/availability.types.js";

export async function listBusinessHours() {
	const { data, error } = await supabaseAdmin.from("business_hours").select("*").order("day_of_week");
	if (error) throw error;
	return (data ?? []) as BusinessHour[];
}

export async function updateBusinessHours(dayOfWeek: number, values: Pick<BusinessHour, "open_time" | "close_time" | "is_open">) {
	const { data, error } = await supabaseAdmin
		.from("business_hours")
		.upsert({ day_of_week: dayOfWeek, ...values, updated_at: new Date().toISOString() }, { onConflict: "day_of_week" })
		.select()
		.single();
	if (error) throw error;
	return data as BusinessHour;
}

export async function listBlockedPeriods() {
	const { data, error } = await supabaseAdmin.from("blocked_periods").select("*").order("starts_at");
	if (error) throw error;
	return (data ?? []) as BlockedPeriod[];
}

export async function createBlockedPeriod(values: Pick<BlockedPeriod, "starts_at" | "ends_at" | "reason">) {
	const { data, error } = await supabaseAdmin.from("blocked_periods").insert(values).select().single();
	if (error) throw error;
	return data as BlockedPeriod;
}

export async function deleteBlockedPeriod(id: string) {
	const { error } = await supabaseAdmin.from("blocked_periods").delete().eq("id", id);
	if (error) throw error;
}

export async function getAvailabilityWindow(date: string) {
	const day = DateTime.fromISO(date, { zone: env.businessTimezone });
	if (!day.isValid) throw new Error("VALIDATION_ERROR: Invalid availability date");
	const { data: hours, error: hoursError } = await supabaseAdmin.from("business_hours").select("*").eq("day_of_week", day.weekday % 7).single();
	if (hoursError) throw hoursError;
	if (!hours.is_open) return null;
	const open = DateTime.fromISO(`${date}T${hours.open_time}`, { zone: env.businessTimezone });
	const close = DateTime.fromISO(`${date}T${hours.close_time}`, { zone: env.businessTimezone });
	return { open, close };
}