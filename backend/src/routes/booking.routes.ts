import { Router } from "express";
import {
	confirmBooking,
	createBooking,
	getHeldBookings,
	rejectBooking,
} from "../controllers/booking.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

export const bookingRouter = Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/pending", requireAdmin, getHeldBookings);
bookingRouter.post("/:id/accept", requireAdmin, confirmBooking);
bookingRouter.post("/:id/decline", requireAdmin, rejectBooking);
