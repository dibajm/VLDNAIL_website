import { z } from "zod";
import type { BookingPayload } from "../types/booking.types.js";

const contactSchema = z.object({
	firstName: z.string().trim().min(1).max(80),
	lastName: z.string().trim().min(1).max(80),
	email: z.string().trim().email().max(254),
	phone: z.string().trim().max(40),
	instagram: z.string().trim().max(80),
});

const bookingSchema = z.object({
	serviceType: z.enum(["newSet", "fill"]),
	service: z.string().trim().min(1).max(80),
	nailLength: z.string().trim().max(30).nullable(),
	nailShape: z.string().trim().max(30).nullable(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	time: z.string().regex(/^\d{1,2}:\d{2} (AM|PM)$/),
	designTier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).nullable(),
	extras: z.array(z.string().trim().min(1).max(80)).max(20),
	contact: contactSchema,
});

export function parseBookingPayload(input: unknown): BookingPayload {
	const result = bookingSchema.safeParse(input);
	if (!result.success) {
		throw new Error(`VALIDATION_ERROR: ${result.error.issues[0]?.message ?? "Invalid booking"}`);
	}
	return result.data;
}
