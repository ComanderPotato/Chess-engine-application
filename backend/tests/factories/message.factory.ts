import { IMessage, MessageModel } from "models/Message.model";
import { Types } from "mongoose";

export async function createMessage(overrides: Partial<IMessage> = {}) {
  return await MessageModel.create({
    conversationId: new Types.ObjectId(),
    senderId: new Types.ObjectId(),
    content: "Hello world",
    ...overrides,
  });
}
