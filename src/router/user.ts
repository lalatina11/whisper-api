import { Router } from "express";
import { getUsers } from "../controllers/user";
import { protectedRoute } from "../middlewares/auth-middleware";

const userRouter = Router();

userRouter.get("/me", protectedRoute, getUsers);

export default userRouter;
