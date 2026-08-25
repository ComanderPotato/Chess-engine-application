import { createConversation } from "#/factories/conversation.factory";
import { api } from "#/helpers/request";
import { ConversationModel, IConversation } from "models/Conversation.model";
import { describe, expect, it, test } from "vitest";

describe("GET /api/conversations/:conversationId", () => {
  it("gets a users conversations", async () => {
    const response = await api.get("/api/conversations/");

    expect(response.status).toBe(200);

    const { conversations } = response.body;

    expect(conversations).toBeDefined();
  });
});
