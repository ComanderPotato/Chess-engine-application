import { createConversation } from "#/factories/conversation.factory";
import { api } from "#/helpers/request";
import { ConversationModel, IConversation } from "models/Conversation.model";
import { describe, expect, it, test } from "vitest";

describe("GET /api/conversations/:conversationId", () => {
  it("gets a conversation by its id", async () => {
    const createdConversation = await createConversation({});

    const response = await api.get("/api/conversations/");

    expect(response.status).toBe(200);

    const { conversation }: { conversation: IConversation } = response.body;

    expect(conversation).toBeDefined();
    expect(conversation.participants.length).toBe(10);
    expect(conversation.lastMessage).toBeUndefined();
  });
});
