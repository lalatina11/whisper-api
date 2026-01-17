import { Router } from "express";

const authRouter = Router();

authRouter.get("/me", (_req, res) => {
	res.status(200).json({ error: false, message: "OK", data: {} });
});

export default authRouter;
