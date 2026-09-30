import type { ErrorRequestHandler } from "express";
import { MulterError } from "multer";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
	console.error(error);

	// Without this, an oversized photo reaches the visitor as a bare "Something
	// went wrong" and they have no idea the file was the problem.
	if (error instanceof MulterError) {
		const message =
			error.code === "LIMIT_FILE_SIZE"
				? "Each photo must be under 10MB. Please choose a smaller file."
				: error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE"
					? "Please attach no more than 5 photos."
					: "That photo could not be uploaded. Please try another file.";
		res.status(400).json({ error: message });
		return;
	}

	// express.json() throws a SyntaxError on an unparseable body; that is the
	// caller's mistake, not ours.
	if (error instanceof SyntaxError && "body" in error) {
		res.status(400).json({ error: "The request body could not be read." });
		return;
	}

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

	if (error instanceof Error && error.message.startsWith("EMAIL_SEND_FAILED:")) {
		res.status(502).json({ error: "The inquiry was not emailed. Please try again." });
		return;
	}

	res.status(500).json({ error: "Something went wrong. Please try again." });
};
