import type { Request } from "express";

export interface AuthRequest extends Request {
	userId?: string;
}

export interface MessageDataForSocket {
	chatId: string;
	text: string;
}
