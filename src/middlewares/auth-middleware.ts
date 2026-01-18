import { getAuth, requireAuth } from "@clerk/express";
import type { NextFunction, Response } from "express";
import UserModel from "../models/user";
import type { AuthRequest } from "../types";

export const protectedRoute = [
	requireAuth(),
	async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const { userId: clerkId } = getAuth(req);
			if (!clerkId) {
				return res.status(401).json({ error: true, message: "Unauthorized!" });
			}
			const user = await UserModel.findOne({ clerkId });
			if (!user) {
				return res
					.status(404)
					.json({ error: true, message: "Cannon found user!" });
			}
			req.userId = user._id.toString();

			next();
		} catch (error) {
			res.status(500);
			next(error);
		}
	},
];
