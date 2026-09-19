import cors from "cors";
import express from "express";
import helmet from "helmet";
import { bookingRouter } from "./routes/booking.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

export function createApp() {
	const app = express();

	app.disable("x-powered-by");
	app.use(helmet());
	app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
	app.use(express.json({ limit: "100kb" }));

	app.get("/health", (_req, res) => {
		res.json({ status: "ok" });
	});

	app.use("/api/booking", bookingRouter);
	app.use(errorHandler);

	return app;
}
