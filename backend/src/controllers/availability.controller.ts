import type { Request, Response } from "express";
import { createBlockedPeriod, deleteBlockedPeriod, listBlockedPeriods, listBusinessHours, updateBusinessHours } from "../services/availability.service.js";

function normalizeTime(value: string | null): string | null {
	if (!value) return null;
	const withSeconds = /^(\d{2}):(\d{2}):\d{2}$/.exec(value);
	if (withSeconds) {
		value = `${withSeconds[1]}:${withSeconds[2]}`;
	}
	const normalizedValue = /^(\d{2}):(\d{2})$/.exec(value);
	if (normalizedValue) {
		const hour = Number(normalizedValue[1]);
		const minute = Number(normalizedValue[2]);
		if (hour <= 23 && minute <= 59) return `${normalizedValue[1]}:${normalizedValue[2]}`;
	}
	const twelveHour = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value);
	if (!twelveHour) return null;
	let hour = Number(twelveHour[1]);
	const minute = Number(twelveHour[2]);
	if (hour < 1 || hour > 12 || minute > 59) return null;
	if (twelveHour[3].toUpperCase() === "PM" && hour !== 12) hour += 12;
	if (twelveHour[3].toUpperCase() === "AM" && hour === 12) hour = 0;
	return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function minutesFromTime(value: string): number {
	const [hour, minute] = value.split(":").map(Number);
	return hour * 60 + minute;
}

export async function getAvailabilitySettings(_req: Request, res: Response) {
	res.json({ hours: await listBusinessHours(), blockedPeriods: await listBlockedPeriods() });
}

export async function patchBusinessHours(req: Request, res: Response) {
	const dayOfWeek = Number(req.params.dayOfWeek);
	const { open_time, close_time, is_open } = req.body as { open_time: string | null; close_time: string | null; is_open: boolean };
	if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6 || typeof is_open !== "boolean") throw new Error("VALIDATION_ERROR: Invalid business hours");
	const normalizedOpen = normalizeTime(open_time);
	let normalizedClose = normalizeTime(close_time);
	if (normalizedOpen && normalizedClose && /^\d{2}:\d{2}$/.test(open_time ?? "") && /^\d{2}:\d{2}$/.test(close_time ?? "") && minutesFromTime(normalizedClose) <= minutesFromTime(normalizedOpen) && Number(close_time?.slice(0, 2)) < 12) {
		const afternoonMinutes = minutesFromTime(normalizedClose) + 12 * 60;
		normalizedClose = `${String(Math.floor(afternoonMinutes / 60)).padStart(2, "0")}:${String(afternoonMinutes % 60).padStart(2, "0")}`;
	}
	if (is_open && (!normalizedOpen || !normalizedClose || normalizedOpen >= normalizedClose)) throw new Error("VALIDATION_ERROR: Invalid open and close times");
	res.json({ hour: await updateBusinessHours(dayOfWeek, { open_time: is_open ? normalizedOpen : null, close_time: is_open ? normalizedClose : null, is_open }) });
}

export async function postBlockedPeriod(req: Request, res: Response) {
	const { starts_at, ends_at, reason = "" } = req.body as { starts_at: string; ends_at: string; reason?: string };
	const start = new Date(starts_at).getTime();
	const end = new Date(ends_at).getTime();
	if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error("VALIDATION_ERROR: Invalid blocked period");
	res.status(201).json({ blockedPeriod: await createBlockedPeriod({ starts_at, ends_at, reason }) });
}

export async function removeBlockedPeriod(req: Request, res: Response) {
	if (typeof req.params.id !== "string" || !/^[0-9a-f-]{36}$/i.test(req.params.id)) throw new Error("VALIDATION_ERROR: Invalid blocked period id");
	await deleteBlockedPeriod(req.params.id);
	res.status(204).send();
}