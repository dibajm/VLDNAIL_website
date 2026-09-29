import { Router } from "express";
import {
	confirmBooking,
	cancelConfirmedBooking,
	createBooking,
	getAvailableSlots,
	getBookingHistory,
	getHeldBookings,
	removeBookingHistory,
	rejectBooking,
} from "../controllers/booking.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

export const bookingRouter = Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/availability", getAvailableSlots);
bookingRouter.get("/pending", requireAdmin, getHeldBookings);
bookingRouter.get("/history", requireAdmin, getBookingHistory);
bookingRouter.post("/:id/accept", requireAdmin, confirmBooking);
bookingRouter.post("/:id/decline", requireAdmin, rejectBooking);
bookingRouter.post("/:id/cancel", requireAdmin, cancelConfirmedBooking);
bookingRouter.delete("/:id/history", requireAdmin, removeBookingHistory);
