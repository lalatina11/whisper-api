import type { Request } from "express";
import type { Socket } from "socket.io";

export interface AuthRequest extends Request {
	userId?: string;
}

export interface SocketWithUserId extends Socket {
	userId?: string;
}

export interface MessageDataForSocket {
	chatId: string;
	text: string;
}
