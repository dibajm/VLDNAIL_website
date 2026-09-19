import type { Request, Response } from "express";
import {
	acceptBooking,
	createHeldBooking,
	declineBooking,
	listHeldBookings,
} from "../services/booking.service.js";
import { notifyBookingDecision, notifyNewBooking } from "../services/notification.service.js";
import { parseBookingPayload } from "../validators/booking.validator.js";

function routeId(req: Request): string {
	const id = req.params.id;
	if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
		throw new Error("VALIDATION_ERROR: Invalid booking id");
	}
	return id;
}

export async function createBooking(req: Request, res: Response) {
	const payload = parseBookingPayload(req.body);
	const booking = await createHeldBooking(payload);
	void notifyNewBooking(booking);
	res.status(201).json({ booking });
}

export async function getHeldBookings(_req: Request, res: Response) {
	const bookings = await listHeldBookings();
	res.json({ bookings });
}

export async function confirmBooking(req: Request, res: Response) {
	const durationMinutes = Number(req.body.durationMinutes);
	if (!Number.isInteger(durationMinutes) || durationMinutes < 30 || durationMinutes > 12 * 60) {
		throw new Error("VALIDATION_ERROR: durationMinutes must be between 30 and 720 minutes");
	}

	const booking = await acceptBooking(routeId(req), durationMinutes);
	void notifyBookingDecision(booking, true);
	res.json({ booking });
}

export async function rejectBooking(req: Request, res: Response) {
	const booking = await declineBooking(routeId(req));
	void notifyBookingDecision(booking, false);
	res.json({ booking });
}
