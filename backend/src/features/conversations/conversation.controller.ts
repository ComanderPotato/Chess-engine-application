import { Req, Res } from "@/shared/types/express.types.js";
import * as conversationService from "./conversation.service.js";
import {
  IConversationByIdParams,
  IMessageBody,
  IStartConversationBody,
} from "./conversation.types.js";
import { Types } from "mongoose";

export async function getMyConversations(req: Req, res: Res) {}
export async function startConversation(
  req: Req<{}, IStartConversationBody>,
  res: Res,
) {
  const { participants } = req.body;
  const conversation =
    await conversationService.startConversation(participants);

  res.status(201).json({ conversation: conversation });
}
export async function getConversation(
  req: Req<IConversationByIdParams>,
  res: Res,
) {
  const { conversationId } = req.params;
  const conversation =
    await conversationService.getConversation(conversationId);
  res.status(200).json({ conversation: conversation });
}
export async function getConversationMessages(
  req: Req<IConversationByIdParams>,
  res: Res,
) {
  const { conversationId } = req.params;
  const data =
    await conversationService.getConversationMessages(conversationId);
  res.status(200).json(data);
}
export async function sendMessage(
  req: Req<IConversationByIdParams, IMessageBody>,
  res: Res,
) {
  const senderId = res.locals.user.id;
  const { conversationId } = req.params;
  const { content } = req.body;
  const message = await conversationService.sendMessage(
    senderId,
    conversationId,
    content,
  );
  res.status(201).json({ message });
}
