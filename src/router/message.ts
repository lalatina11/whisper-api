import { Router } from "express";

const messageRouter = Router();

messageRouter.get("/me", (_req, res) => {
	res.status(200).json({ error: false, message: "OK", data: {} });
});

export default messageRouter;
