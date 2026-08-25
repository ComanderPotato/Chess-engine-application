import {
  generateRandomObjectId,
  generateRandomObjectIds,
} from "#/helpers/generators.helper";
import { api } from "#/helpers/request";
import { Types } from "mongoose";
import { describe, expect, it, test } from "vitest";

describe.todo("POST /api/conversations", () => {
  test.for([
    { participantCount: 2 },
    { participantCount: 4 },
    { participantCount: 10 },
  ])(
    "creating conversation with $participantCount participants",
    async ({ participantCount }) => {
      const participants = generateRandomObjectIds(participantCount);
      const response = await api
        .post("/api/conversations")
        .send({ participants: participants });

      expect(response.status).toBe(201);

      const { conversation } = response.body;
      expect(conversation).toBeDefined();
      expect(conversation.participants.length).toBe(participantCount);
    },
  );
});
