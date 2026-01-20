import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import ENV from "./config/env";
import { errorHandler } from "./middlewares/error-handler";
import authRouter from "./router/auth";
import chatRouter from "./router/chat";
import messageRouter from "./router/message";
import userRouter from "./router/user";

const app = express();

app.use(express.json());
app.use(cors({ allowedHeaders: [ENV.CLIENT_URL] }));
app.use(clerkMiddleware());
app.use(morgan("tiny"));

app.get("/", (_req, res) => {
	res
		.status(200)
		.json({ error: false, message: "OK", date: new Date(Date.now()) });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(errorHandler);

export default app;
