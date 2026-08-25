import { HydratedDocument, Schema, Types, model } from "mongoose";

export interface IMessage {
  id: string;
  conversationId: Types.ObjectId;

  senderId: Types.ObjectId;

  content: string;

  createdAt: Date;
  editedAt?: Date;
}

export const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    editedAt: Date,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

export const MessageModel = model<IMessage>("Message", MessageSchema);
export type MessageDocument = HydratedDocument<IMessage>;
