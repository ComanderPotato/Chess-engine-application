import { createUserSession } from "#/factories/user-session.factory.js";
import { assertModel } from "#/helpers/assert.js";
import {
  generateRandomTokenHash,
  generateRandomObjectId,
} from "#/helpers/generators.helper.js";
import * as userSessionRepository from "@/features/user-sessions/user-session.repository.js";
import { IUserSession } from "models/User-Session.model.js";
import { IUser } from "models/User.model.js";
import { beforeEach, describe, expect, it } from "vitest";

describe("User session repository", () => {
  describe("create", () => {
    it("creates and returns a user session", async () => {});
  });

  describe("existing user session", () => {
    let userSession: IUserSession;
    beforeEach(async () => {
      const data = await createUserSession();
      userSession = data.userSession;
    });
    describe("findById", () => {
      it("returns the user session", async () => {
        const response = await userSessionRepository.findById(userSession.id);
        expect(response).not.toBeNull();
        if (!response) return;
        assertModel(response, userSession, [
          "id",
          "userId",
          "tokenHash",
          "expiresAt",
        ]);
      });
      it("returns null when the session does not exist", async () => {
        const response = await userSessionRepository.findById(
          generateRandomObjectId(),
        );
        expect(response).toBeNull();
      });
    });
    describe("findByUserId", () => {
      it("returns the user session", async () => {
        const response = await userSessionRepository.findByUserId(
          userSession.userId,
        );
        expect(response).not.toBeNull();
        if (!response) return;
        assertModel(response, userSession, [
          "id",
          "userId",
          "tokenHash",
          "expiresAt",
        ]);
      });
      it("returns null when the session does not exist", async () => {
        const response = await userSessionRepository.findByUserId(
          generateRandomObjectId(),
        );
        expect(response).toBeNull();
      });
    });
    describe("findByTokenHash", () => {
      it("returns the user session", async () => {
        const response = await userSessionRepository.findByTokenHash(
          userSession.tokenHash,
        );
        expect(response).not.toBeNull();
        if (!response) return;
        assertModel(response, userSession, [
          "id",
          "userId",
          "tokenHash",
          "expiresAt",
        ]);
      });
      it("returns null when the session does not exist", async () => {
        const response = await userSessionRepository.findByTokenHash(
          generateRandomTokenHash(),
        );
        expect(response).toBeNull();
      });
    });
    describe.only("updateById", () => {
      let updates: Partial<IUserSession>;
      beforeEach(async () => {
        updates = {
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        };
      });
      it.only("returns the updated user session", async () => {
        const response = await userSessionRepository.updateById(
          userSession.id,
          updates,
        );
        expect(response).not.toBeNull();
        if (!response) return;
        assertModel(response, userSession, ["id", "userId", "tokenHash"]);
        assertModel(response, updates, ["expiresAt"]);
      });
      it("returns null when the session does not exist", async () => {
        const response = await userSessionRepository.updateById(
          generateRandomObjectId(),
          updates,
        );
        expect(response).toBeNull();
      });
    });
    describe("deleteById", () => {
      it("returns true when the user session is deleted", async () => {
        const response = await userSessionRepository.deleteById(userSession.id);
        expect(response).toBe(true);
      });
      it("returns false when the user session does not exist", async () => {
        const response = await userSessionRepository.deleteById(
          generateRandomObjectId(),
        );
        expect(response).toBe(false);
      });
    });
  });
});
