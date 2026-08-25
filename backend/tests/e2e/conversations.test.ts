import { createUser } from "#/factories/user.factory";
import { api } from "#/helpers/request";
import { beforeAll, describe, expect, it } from "vitest";

describe("Conversation between two users", () => {
  let userA: any;
  let userB: any;

  let t = null;
  beforeAll(async () => {
    const resA = await createUser();
    const resB = await createUser();

    userA = resA.user;
    userB = resB.user;
  });

  it("makes a conversation between the two users", async () => {
    const participants = [userA.id, userB.id];
    const response = await api
      .post("/api/conversations")
      .send({ participants });

    expect(response.status).toBe(201);

    const { conversation } = response.body;
    t = conversation.id;
    expect(conversation).toBeDefined();

    expect(conversation.participants).toEqual(
      expect.arrayContaining(participants),
    );
  });
  it("Fart", async () => {
    const response = await api.get(`/api/conversations/${t!}`);
    console.log(response.body);
  });
});
