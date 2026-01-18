import { Router } from "express";
import { getMessages } from "../controllers/message";
import { protectedRoute } from "../middlewares/auth-middleware";

const messageRouter = Router();

messageRouter.get("/chat/:chatId", protectedRoute, getMessages);

export default messageRouter;
