import { Router } from "express";

const userRouter = Router();

userRouter.get("/me", (_req, res) => {
	res.status(200).json({ error: false, message: "OK", data: {} });
});

export default userRouter;
