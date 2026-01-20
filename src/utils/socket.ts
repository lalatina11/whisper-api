import type { Server as HttpServer } from "node:http";
import { verifyToken } from "@clerk/express";
import { Server as SocketIOServer } from "socket.io";
import ENV from "../config/env";

import ChatModel from "../models/chat";
import MessageModel from "../models/message";
import UserModel from "../models/user";
import type { MessageDataForSocket, SocketWithUserId } from "../types";

// store online users in memory: userId => socketId
export const onlineUsers = new Map<string, string>();

export const initializeSocket = async (httpServer: HttpServer) => {
	// verify socket connection - if the user is authenticated, we will store the user id in the socket
	const io = new SocketIOServer(httpServer, {
		cors: { origin: [ENV.CLIENT_URL] },
	});

	io.use(async (socket: SocketWithUserId, next) => {
		const token = socket.handshake.auth.token; //token from client
		if (!token) return next(new Error("Missing Socket IO Token"));
		try {
			const session = await verifyToken(token, {
				secretKey: ENV.CLERK_SECRET_KEY,
			});
			if (!session.sub) {
				return next(new Error("Invalid Token!"));
			}
			const clerkId = session.sub;
			const user = await UserModel.findOne({ clerkId });
			if (!user) {
				return next(new Error("Invalid User!"));
			}
			socket.userId = user._id.toString();
			next();
		} catch (error) {
			const errMessage =
				ENV.NODE_ENV !== "production"
					? (error as Error).message || "Something went wrong!"
					: "Cannot Authorizing";
			const err = new Error(errMessage);
			next(err);
		}
	});

	// this "connection" event name is special and should be written like this
	// it's the event that is triggered when a new client connects to the server
	io.on("connection", (socket: SocketWithUserId) => {
		const { userId } = socket;
		if (!userId) throw new Error("User is not connected");

		// send list of currently online users to the newly connected client
		socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

		// store user in the onlineUsers map
		onlineUsers.set(userId, socket.id);

		// notify others that this current user is online
		socket.broadcast.emit("user-online", { userId });

		socket.join(`user:${userId}`);

		socket.on("join-chat", (chatId: string) => {
			socket.join(`chat:${chatId}`);
		});

		socket.on("leave-chat", (chatId: string) => {
			socket.leave(`chat:${chatId}`);
		});

		// handle Seding messages
		socket.on("send-message", async (data: Partial<MessageDataForSocket>) => {
			try {
				const { chatId, text } = data;
				const chat = await ChatModel.findOne({
					_id: chatId,
					participants: userId,
				});
				if (!chat) {
					return socket.emit("socket-error", { message: "Chat not found" });
				}
				const message = new MessageModel({
					chat: chat._id,
					sender: userId,
					text,
				});
				chat.lastMessage = message._id;
				chat.lastMessageAt = new Date(Date.now());
				await message.save();
				await message.populate("sender", "name email avatar");

				// emit to room chat
				io.to(`chat:${chat._id}`).emit("new-message", message);

				// emit for all participants's personal room (for chat list view)
				for (const participantId of chat.participants) {
					io.to(`user:${participantId}`).emit("new-message", message);
				}
			} catch (error) {
				console.log(error);
				socket.emit("socket-error", {
					message:
						ENV.NODE_ENV !== "production"
							? (error as Error).message
							: "Something went wrong",
				});
			}
		});

		// TODO
		// socket.on("typing-message",async(data) => {})

		socket.on("disconnect", async () => {
			onlineUsers.delete(userId);

			// notify others
			socket.broadcast.emit("user-offline", { userId });
		});
	});
	return io;
};
