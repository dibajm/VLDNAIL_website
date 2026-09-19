import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
	console.error(error);

	if (error instanceof Error && error.message === "BOOKING_TIME_UNAVAILABLE") {
		res.status(409).json({ error: "That time is no longer available." });
		return;
	}

	if (error instanceof Error && error.message === "BOOKING_HOLD_EXPIRED") {
		res.status(409).json({ error: "This booking hold has expired." });
		return;
	}

	if (typeof error === "object" && error !== null && "code" in error && error.code === "23P01") {
		res.status(409).json({ error: "That time is already being held or booked." });
		return;
	}

	if (error instanceof Error && error.message.startsWith("VALIDATION_ERROR:")) {
		res.status(400).json({ error: error.message.replace("VALIDATION_ERROR:", "").trim() });
		return;
	}

	res.status(500).json({ error: "Something went wrong. Please try again." });
};
