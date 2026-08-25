import { Types } from "mongoose";

export interface IStartConversationBody {
  participants: Types.ObjectId[];
}
export interface IConversationByIdParams {
  conversationId: string;
}

export interface IMessageBody {
  content: string;
}
