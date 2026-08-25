import { createUser } from "#/factories/user.factory";
import { validUserCredentials } from "#/fixtures/auth.fixture";
import { api } from "#/helpers/request";
import { describe, expect, it, test } from "vitest";

describe("Auth", () => {
  describe("POST /api/auth/login", () => {
    it("logs a user in with existing credentials", async () => {
      const { user, password } = await createUser();
      const response = await api
        .post("/api/auth/login")
        .send({ username: user.username, password });
      expect(response.status).toBe(200);
    });
    it("doesn't log user in with wrong or non-existent credentials", async () => {
      const response = await api
        .post("/api/auth/login")
        .send({ validUserCredentials });
      expect(response.status).toBe(401);
    });
  });
});
