import type { NextFunction, Response } from "express";
import UserModel from "../models/user";
import type { AuthRequest } from "../types";

export const getUsers = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId } = req;
		if (!userId) {
			return res.status(401).json({ error: true, message: "Not Authorized!" });
		}
		const users = await UserModel.find({ _id: { $ne: userId } }).select(
			"name email avatar",
		);
		return res.status(200).json({ error: false, message: "OK", data: users });
	} catch (error) {
		res.status(200);
		next(error);
	}
};
