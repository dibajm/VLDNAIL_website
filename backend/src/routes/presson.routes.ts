import { Router } from "express";
import multer from "multer";
import { createPressOnInquiry } from "../controllers/presson.controller.js";

const upload = multer({
	 storage: multer.memoryStorage(),
	 // Photos straight off a phone routinely land between 3 and 8MB.
	 limits: { files: 5, fileSize: 10 * 1024 * 1024 },
});

export const pressOnRouter = Router();

pressOnRouter.post("/", upload.array("photos", 5), createPressOnInquiry);
