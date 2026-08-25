import { generateRandomObjectIds } from "#/helpers/generators.helper";
import { ConversationModel, IConversation } from "models/Conversation.model";
import { Types } from "mongoose";

export async function createConversation(
  options: {
    participantCount?: number;
    overrides?: Partial<IConversation>;
    authenticatedParticipant?: Types.ObjectId | null;
  } = { overrides: {} },
) {
  const { participantCount, overrides, authenticatedParticipant } = options;
  const participants = generateRandomObjectIds(participantCount);
  authenticatedParticipant && participants.push(authenticatedParticipant);
  return await ConversationModel.create({
    participants: generateRandomObjectIds(participantCount),
    ...overrides,
  });
}
