import { IConversation } from "models/Conversation.model.js";
import { Types } from "mongoose";

export interface ConversationEntity extends IConversation {
  id: string;
}

export interface CreateConversationDTO {
  participants: Types.ObjectId[];
}
export interface UpdateConversationDTO {
  participants?: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
}
