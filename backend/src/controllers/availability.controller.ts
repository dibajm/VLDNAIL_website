import type { Request, Response } from "express";
import { createBlockedPeriod, deleteBlockedPeriod, listBlockedPeriods, listBusinessHours, updateBusinessHours } from "../services/availability.service.js";

export async function getAvailabilitySettings(_req: Request, res: Response) {
	res.json({ hours: await listBusinessHours(), blockedPeriods: await listBlockedPeriods() });
}

export async function patchBusinessHours(req: Request, res: Response) {
	const dayOfWeek = Number(req.params.dayOfWeek);
	const { open_time, close_time, is_open } = req.body as { open_time: string | null; close_time: string | null; is_open: boolean };
	if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6 || typeof is_open !== "boolean") throw new Error("VALIDATION_ERROR: Invalid business hours");
	if (is_open && (typeof open_time !== "string" || typeof close_time !== "string" || !/^\d{2}:\d{2}$/.test(open_time) || !/^\d{2}:\d{2}$/.test(close_time) || open_time >= close_time)) throw new Error("VALIDATION_ERROR: Invalid open and close times");
	res.json({ hour: await updateBusinessHours(dayOfWeek, { open_time: is_open ? open_time : null, close_time: is_open ? close_time : null, is_open }) });
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