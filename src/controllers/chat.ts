import type { NextFunction, Response } from "express";
import ChatModel from "../models/chat";
import type { AuthRequest } from "../types";

export const getChats = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId } = req;
		if (!userId) {
			return res.status(401).json({ error: true, message: "Not Authorized" });
		}
		const chat = await ChatModel.find({ participants: userId })
			.populate("participants", "name email avatar")
			.populate("lastMessage")
			.sort({ lastMessageAt: -1 });
		const formattedChat = chat.map((chat) => {
			const otherPartiicipant = chat.participants.find(
				(party) => party._id.toString() !== userId,
			);
			return {
				_id: chat._id,
				participant: otherPartiicipant || null,
				lastMessage: chat.lastMessage || null,
				lastMessageAt: chat.lastMessageAt || null,
				createdAt: chat.createdAt || null,
			};
		});

		return res
			.status(200)
			.json({ error: false, message: "OK", data: formattedChat });
	} catch (error) {
		res.status(500);
		next(error);
	}
};
export const getOrCreateChat = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId } = req;
		if (!userId) {
			return res.status(401).json({ error: true, message: "Not Authorized" });
		}
		const { participantId } = req.params;

		if (!participantId) {
			return res
				.status(400)
				.json({ error: true, message: "Missing Participant ID" });
		}

		let chat = await ChatModel.findOne({
			participants: { $all: [userId, participantId] },
		})
			.populate("participants", "name email avatar")
			.populate("lastMessage");
		if (!chat) {
			const newChat = new ChatModel({ participants: [userId, participantId] });
			await newChat.save();
			chat = await newChat.populate("participants", "name email avatar");
			chat = await chat.populate("lastMessage");
		}
		const otherParticipant = chat.participants.find(
			(party) => party._id.toString() !== userId,
		);
		const data = {
			_id: chat._id,
			participant: otherParticipant || null,
			lastMessage: chat.lastMessage || null,
			lastMessageAt: chat.lastMessageAt || null,
			createdAt: chat.createdAt,
		};
		return res.status(200).json({ error: false, message: "OK", data });
	} catch (error) {
		res.status(500);
		next(error);
	}
};
