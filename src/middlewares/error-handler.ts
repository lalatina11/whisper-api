import type { NextFunction, Request, Response } from "express";
import ENV from "../config/env";

export const errorHandler = (
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	console.log(error);
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	const productionMessage =
		statusCode === 500
			? "Internal Server Error"
			: statusCode === 401
				? "Unathorized"
				: statusCode === 404
					? "Not Found"
					: "Something went wrong!";
	const message =
		ENV.NODE_ENV === "development" ? error.stack : productionMessage;
	res.status(statusCode).json({ error: true, message });
};
