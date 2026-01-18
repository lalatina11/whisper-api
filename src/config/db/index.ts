import mongoose from "mongoose";
import ENV from "../env";

export const connectDB = async () => {
	try {
		await mongoose.connect(ENV.DATABASE_URL);
		console.log("MongoDB connected");
	} catch (error) {
		console.log("Error: MongoDB Connection Error");
		console.log(error);
		process.exit(1);
	}
};
