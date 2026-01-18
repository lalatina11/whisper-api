import { clerkClient, getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import UserModel from "../models/user";
import type { AuthRequest } from "../types";

export const getCurrentUser = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = req.userId;
		if (!id) {
			return res.status(401).json({ error: true, message: "Unauthorized!" });
		}
		const user = await UserModel.findById(id);

		if (!user) {
			return res
				.status(404)
				.json({ error: true, message: "Cannon found user!" });
		}
		return res
			.status(200)
			.json({ error: false, message: "OK", data: user.toObject() });
	} catch (error) {
		res.status(500);
		next(error);
	}
};

export const authCallback = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId: clerkId } = getAuth(req);
		if (!clerkId) {
			return res.status(401).json({ error: true, message: "Unauthorized!" });
		}

		let user = await UserModel.findOne({ clerkId });

		if (!user) {
			const clerkUser = await clerkClient.users.getUser(clerkId);
			if (!clerkUser) {
				return res.status(401).json({ error: true, message: "Unauthorized!" });
			}
			user = await UserModel.create({
				clerkId: clerkUser.id,
				email: clerkUser.primaryEmailAddress?.emailAddress,
				name:
					clerkUser.fullName ??
					clerkUser.primaryEmailAddress?.emailAddress.split("@")[0],
				avatar: clerkUser.imageUrl || "",
			});
			await user.save();
		}
		return res.status(200).json({ error: false, message: "OK", data: user });
	} catch (error) {
		res.status(500);
		next(error);
	}
};
