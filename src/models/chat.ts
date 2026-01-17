import mongoose, { type Document, Schema } from "mongoose";

export interface Chat extends Document {
	participants: Array<mongoose.Types.ObjectId>;
	lastMessage?: mongoose.Types.ObjectId;
	lastMessageAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const ChatShema = new Schema<Chat>(
	{
		participants: [
			{ type: Schema.Types.ObjectId, ref: "User", required: true },
		],
		lastMessage: {
			type: Schema.Types.ObjectId,
			ref: "Message",
			default: null,
		},
		lastMessageAt: {
			type: Date,
			default: new Date(Date.now()),
		},
	},
	{ timestamps: true },
);

export const ChatModel = mongoose.model("Chat", ChatShema);

export default ChatModel;
