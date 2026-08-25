import {
  ConversationDocument,
  ConversationModel,
} from "models/Conversation.model.js";
import mongoose, { Types } from "mongoose";

export async function create(participants: Types.ObjectId[]) {
  return ConversationModel.create({ participants });
}
export async function findById(conversationId: string) {
  return await ConversationModel.findById(conversationId);
}
export async function updateLastMessage(
  conversationId: string,
  messageId: string,
) {
  const updatedConversation = await ConversationModel.findByIdAndUpdate(
    conversationId,
    { $set: { lastMessage: messageId } },
    { returnDocument: "after" },
  );
  return updatedConversation;
}
