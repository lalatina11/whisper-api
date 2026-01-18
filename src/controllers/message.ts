import type { NextFunction, Response } from "express";
import ChatModel from "../models/chat";
import MessageModel from "../models/message";
import type { AuthRequest } from "../types";

export const getMessages = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId } = req;
		if (!userId) {
			return res.status(401).json({ error: true, message: "Not Authorized" });
		}
		const { chatId } = req.params;
		const chat = await ChatModel.findOne({ _id: chatId, participants: userId });
		if (!chat) {
			return res.status(404).json({ error: true, message: "Not Found" });
		}
		const messages = await MessageModel.find({ chat: chat._id })
			.populate("sender", "name email avatar")
			.sort({ createdAt: 1 });
		return res
			.status(200)
			.json({ error: false, message: "OK", data: messages });
	} catch (error) {
		res.status(500);
		next(error);
	}
};
