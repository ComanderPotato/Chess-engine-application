import { Types } from "mongoose";
import * as conversationRepository from "./conversation.repository.js";
import * as messageService from "../messages/message.service.js";
import * as messageRepository from "../messages/message.repository.js";
import { IMessageBody } from "./conversation.types.js";
import { IMessage } from "models/Message.model.js";
import { Internal } from "@/shared/errors/server.error.js";
import { NotFound } from "@/shared/errors/client.error.js";

export async function getConversation(conversationId: string) {
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) throw new NotFound("Conversation not found");
  return conversation;
}

export async function getConversationMessages(conversationId: string) {
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) throw new NotFound("Conversation not found");

  let messages: IMessage[] = [];
  if (conversation.lastMessage) {
    messages = (await messageRepository.findByConversationId(
      conversationId,
    )) as IMessage[];
  }

  return { conversation, messages };
}

export async function sendMessage(
  senderId: string,
  conversationId: string,
  content: string,
) {
  const message = await messageRepository.create(
    senderId,
    conversationId,
    content,
  );
  await conversationRepository.updateLastMessage(conversationId, message.id);
  return message;
}

export async function startConversation(participants: Types.ObjectId[]) {
  return await conversationRepository.create(participants);
}
