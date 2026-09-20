import { Router } from "express";
import { getAvailabilitySettings, patchBusinessHours, postBlockedPeriod, removeBlockedPeriod } from "../controllers/availability.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

export const availabilityRouter = Router();
availabilityRouter.use(requireAdmin);
availabilityRouter.get("/", getAvailabilitySettings);
availabilityRouter.patch("/hours/:dayOfWeek", patchBusinessHours);
availabilityRouter.post("/blocked-periods", postBlockedPeriod);
availabilityRouter.delete("/blocked-periods/:id", removeBlockedPeriod);