import { Router } from "express";
import { authCallback, getCurrentUser } from "../controllers/auth";
import { protectedRoute } from "../middlewares/auth-middleware";

const authRouter = Router();

authRouter.get("/me", protectedRoute, getCurrentUser);
authRouter.post("/callback", protectedRoute, authCallback);

export default authRouter;
