import {
  IMessage,
  MessageDocument,
  MessageModel,
} from "models/Message.model.js";

export async function create(
  senderId: string,
  conversationId: string,
  content: string,
) {
  return await MessageModel.create({
    conversationId,
    senderId,
    content,
  });
}

export async function findByConversationId(
  conversationId: string,
): Promise<IMessage[]> {
  return await MessageModel.find({ conversationId });
}
//
// export async function createSession(
//   userId: string,
//   tokenHash: string,
// ): Promise<SessionDocument> {
//   return await SessionModel.create({
//     userId,
//     tokenHash,
//   });
// }
//
// export async function findById(id: string): Promise<SessionDocument | null> {
//   return await SessionModel.findById(id);
// }
// export async function findByToken(
//   tokenHash: string,
// ): Promise<SessionDocument | null> {
//   return await SessionModel.findOne({ tokenHash });
// }
// export async function invalidate(id: string): Promise<SessionDocument | null> {
//   return await SessionModel.findByIdAndDelete(id);
// }
