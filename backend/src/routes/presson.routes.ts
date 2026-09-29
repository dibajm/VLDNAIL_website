import { Router } from "express";
import multer from "multer";
import { createPressOnInquiry } from "../controllers/presson.controller.js";

const upload = multer({
	 storage: multer.memoryStorage(),
	 limits: { files: 5, fileSize: 5 * 1024 * 1024 },
});

export const pressOnRouter = Router();

pressOnRouter.post("/", upload.array("photos", 5), createPressOnInquiry);
