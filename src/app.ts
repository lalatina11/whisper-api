import cors from "cors";
import express from "express";
import authRouter from "./router/auth";
import chatRouter from "./router/chat";
import messageRouter from "./router/message";
import userRouter from "./router/user";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
	res
		.status(200)
		.json({ error: false, message: "OK", date: new Date(Date.now()) });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

export default app;
