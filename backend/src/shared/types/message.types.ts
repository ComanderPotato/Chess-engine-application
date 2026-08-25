import { IMessage } from "models/Message.model.js";
import { Types } from "mongoose";

export interface MessageEntity extends IMessage {
  id: string;
}

export interface CreateMessageDTO {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
}

export interface UpdateMessageDTO {
  content?: string;
}
