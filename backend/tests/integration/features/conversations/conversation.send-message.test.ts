// import { createConversation } from "#/factories/conversation.factory";
// import { api } from "#/helpers/request";
// import { createMessage } from "#/factories/message.factory";
// import { ConversationModel, IConversation } from "models/Conversation.model";
// import { describe, expect, it, test } from "vitest";
// import { objectIdGenerator } from "#/helpers/generators.helper";
// import { createAuthenticatedRequest } from "#/helpers/authenticatedRequest.helper";
//
// describe.only("POST /api/conversations/:conversationId/messages", () => {
//   it("sends a message in the conversation", async () => {
//     const { agent, user } = await createAuthenticatedRequest();
//
//     const createdConversation = await createConversation(10);
//     const messageData = {
//       content: "Whassup",
//     };
//
//     const response = await agent
//       .post(`/api/conversations/${createdConversation.id}/messages`)
//       .send(messageData);
//
//     expect(response.status).toBe(201);
//
//     const { message } = response.body;
//
//     expect(message).toBeDefined();
//     expect(message.conversationId).toBe(createdConversation.id);
//     expect(message.content).toBe(messageData.content);
//   });
// });
