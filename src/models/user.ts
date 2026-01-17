import mongoose, { type Document, Schema } from "mongoose";

export interface User extends Document {
	clerkId: string;
	name: string;
	email: string;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<User>(
	{
		clerkId: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		avatar: {
			type: String,
			required: false,
			default: "",
		},
	},
	{ timestamps: true },
);

export const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
