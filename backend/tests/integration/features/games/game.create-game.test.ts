import { createGame } from "#/factories/game.factory";
import { api } from "#/helpers/request";
import { describe, expect, it } from "vitest";

describe.todo("Creates games", () => {
  it("Creates a game with two users", async () => {
    const response = await api.post("/api/game");

    expect(response.status).toBe(201);

    expect(response.body.game).toBeDefined();
  });
});
