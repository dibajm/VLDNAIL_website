import rateLimit from "express-rate-limit";

// A held booking blocks its slot for 24 hours, so an unthrottled submit endpoint
// lets one script tie up the whole calendar. These caps sit well above what a
// real visitor does and well below what an abusive one needs.
export const submitLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	// Mobile carriers put many subscribers behind one address, so the cap has to
	// clear a household or a coffee shop while still throttling a script.
	limit: 12,
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: { error: "Too many requests. Please try again later." },
});

export const readLimiter = rateLimit({
	windowMs: 60 * 1000,
	limit: 120,
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: { error: "Too many requests. Please try again later." },
});
