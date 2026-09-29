import type { Request, Response } from "express";
import { z } from "zod";
import { notifyPressOnInquiry } from "../services/notification.service.js";
import { formatPressOnEmail } from "../services/utils/formatpressonEmail.js";

const pressOnInquirySchema = z.object({
	firstName: z.string().trim().min(1).max(80),
	lastName: z.string().trim().min(1).max(80),
	email: z.string().trim().email().max(254),
	phone: z.string().trim().max(40).default(""),
	instagram: z.string().trim().max(80).default(""),
	length: z.string().trim().min(1).max(30),
	shape: z.string().trim().min(1).max(30),
	occasion: z.string().trim().max(50).default(""),
	details: z.string().trim().max(3000).default(""),
});

export async function createPressOnInquiry(req: Request, res: Response) {
	const parsed = pressOnInquirySchema.safeParse(req.body);
	if (!parsed.success) throw new Error("VALIDATION_ERROR: Please complete the required press-on fields");

	const files = (req.files as Express.Multer.File[] | undefined) ?? [];
	const invalidFile = files.find((file) => !file.mimetype.startsWith("image/"));
	if (invalidFile) throw new Error("VALIDATION_ERROR: Reference files must be images");

	const email = formatPressOnEmail(parsed.data);
	await notifyPressOnInquiry(
		email.subject,
		email.html,
		files.map((file) => ({ filename: file.originalname, content: file.buffer })),
	);
	res.status(202).json({ message: "Press-on inquiry sent" });
}
