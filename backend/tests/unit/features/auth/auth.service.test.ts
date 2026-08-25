import { createUser } from "#/factories/user.factory.js";
import { IUser } from "models/User.model.js";
import * as authService from "@/features/auth/auth.service.js";
import { assertModel } from "#/helpers/assert.js";
import { validUserCredentials } from "#/fixtures/auth.fixture.js";
import { BadRequest, Unauthorized } from "@/shared/errors/client.error.js";
import { createUserSession } from "#/factories/user-session.factory.js";
import { generateToken } from "@/shared/utils/token.util.js";
import {
  generateValidEmail,
  generateValidUsername,
} from "#/helpers/generators.helper.js";

import { beforeEach, describe, expect, it } from "vitest";
describe("Auth service", () => {
  describe.only("Signing up", () => {
    describe.only("a user up with unique credentials", () => {
      it("returns the user, userSession, and token", async () => {
        const response = await authService.handleSignup(validUserCredentials);

        const email = await generateValidUsername();
        console.log(email);
        expect(response).not.toBeNull();

        const { user, userSession, token } = response;

        expect(user).not.toBeNull();
        expect(userSession).not.toBeNull();
        expect(token).not.toBeNull();
      });
    });
    describe("a user with non-unique credentials", () => {
      let user: IUser;
      beforeEach(async () => {
        const createdUser = await createUser(validUserCredentials);
        user = createdUser.user;
      });

      it("doesn't sign up a user with non-unique username and email", async () => {
        const invalidResponse = authService.handleSignup(validUserCredentials);

        await expect(invalidResponse).rejects.toThrow(
          "Username and email taken",
        );
        await expect(invalidResponse).rejects.toBeInstanceOf(BadRequest);
      });
      it("doesn't sign up a user with non-unique username", async () => {
        const invalidResponse = authService.handleSignup({
          ...validUserCredentials,
          email: "Dummyemail@test.com",
        });

        await expect(invalidResponse).rejects.toThrow("Username taken");
        await expect(invalidResponse).rejects.toBeInstanceOf(BadRequest);
      });
      it("doesn't sign up a user with non-unique email", async () => {
        const invalidResponse = authService.handleSignup({
          ...validUserCredentials,
          username: "DummyUsername",
        });

        await expect(invalidResponse).rejects.toThrow("Email taken");
        await expect(invalidResponse).rejects.toBeInstanceOf(BadRequest);
      });
    });
  });

  describe("Verification and Authentication", () => {
    let user: IUser;
    let password: string;
    beforeEach(async () => {
      const createdUser = await createUser();
      user = createdUser.user;
      password = createdUser.password;
    });
    describe("Verification and Authentication", () => {
      describe("Valid credentials and existing use", () => {
        it("returns only the user with remember me set to false", async () => {
          const response = await authService.authenticateUser({
            username: user.username,
            password,
            rememberMe: false,
          });
          expect(response.user).not.toBeNull();
          assertModel(user, response.user, ["id", "username", "email"]);
          expect(response.userSession).toBeNull();
          expect(response.token).toBeNull();
        });
        it("returns the user, userSession, and token with remember me set to true", async () => {
          const response = await authService.authenticateUser({
            username: user.username,
            password,
            rememberMe: true,
          });
          expect(response.user).not.toBeNull();
          assertModel(user, response.user, ["id", "username", "email"]);
          expect(response.userSession).not.toBeNull();
          expect(response.token).not.toBeNull();
        });
      });
      it("returns null with invalid credentials", async () => {
        const invalidResponse = authService.authenticateUser({
          username: "DummyUsername",
          password: "DummyPassword",
          rememberMe: true,
        });

        await expect(invalidResponse).rejects.toThrow(
          "Invalid username or password",
        );
        await expect(invalidResponse).rejects.toBeInstanceOf(Unauthorized);
      });
    });
  });
  describe.only("Logging out", () => {
    it("successfully logs out a signed in user", async () => {
      const { user } = await createUser();
      const { token, userSession } = await createUserSession({
        userId: user.id,
      });

      const response = authService.handleLogout(token);

      await expect(response).resolves.not.toThrow();
    });
    it("unsuccessfully logs out a user that isn't signed in", async () => {
      const response = authService.handleLogout(generateToken());

      await expect(response).rejects.toThrow();
    });
  });
});
// --reporter <name>
// Specify reporters (default, agent, minimal, blob, verbose, dot, json, tap, tap-flat, junit
