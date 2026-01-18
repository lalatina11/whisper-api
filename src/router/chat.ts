import { Router } from "express";
import { getChats, getOrCreateChat } from "../controllers/chat";
import { protectedRoute } from "../middlewares/auth-middleware";

const chatRouter = Router();

chatRouter.use(protectedRoute);

chatRouter.get("/", getChats);
chatRouter.get("/with/:participantId", getOrCreateChat);

export default chatRouter;
