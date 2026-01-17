import { Router } from "express";

const chatRouter = Router();

chatRouter.get("/me", (_req, res) => {
	res.status(200).json({ error: false, message: "OK", data: {} });
});

export default chatRouter;
