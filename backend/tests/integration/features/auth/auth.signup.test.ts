import {
  invalidCredentialPassword,
  invalidCredentialUsername,
  validUserCredentials,
} from "#/fixtures/auth.fixture";
import { api } from "#/helpers/request";
import { createUser } from "#/factories/user.factory";
import { describe, expect, it, test } from "vitest";

describe("Auth", () => {
  describe("POST /api/auth/signup", () => {
    test.for([
      {
        credentials: validUserCredentials,
        expectedStatus: 201,
        isDefined: true,
        message: "valid credentials",
      },
      {
        credentials: invalidCredentialUsername,
        expectedStatus: 400,
        isDefined: false,
        message: "invalid username",
      },
      {
        credentials: invalidCredentialPassword,
        expectedStatus: 400,
        isDefined: false,
        message: "invalid password",
      },
    ])(
      "signs user up with $message",
      async ({ credentials, expectedStatus, isDefined }) => {
        const response = await api.post("/api/auth/signup").send(credentials);

        if (isDefined) {
          expect(response.body.user).toBeDefined();
        } else {
          expect(response.body.user).toBeUndefined();
        }
        expect(response.status).toBe(expectedStatus);
      },
    );
  });
  // it("Signs a user up with valid credentials", async () => {
  //   const response = await api
  //     .post("/api/auth/signup")
  //     .send(validUserCredentials);
  //   expect(response.status).toBe(201);
  //
  //   const { user } = response.body;
  //   expect(user).toBeDefined();
  //   expect(user.username).toBe(validUserCredentials.username);
  // });
  //
  // test("Signing up a user with same credentials", async () => {
  //   const { user, password } = await createUser();
  //   const response = await api
  //     .post("/api/auth/signup")
  //     .send({ username: user.username, email: user.email, password });
  //   expect(response.status).toBe(400);
  // });
  // test("invalid username", async () => {
  //   const response = await api
  //     .post("/api/auth/signup")
  //     .send(invalidCredentialUsername);
  //   expect(response.status).toBe(400);
  //
  //   expect(response.body.user).toBeUndefined();
  //   const { username, email, password } = response.body.errors.fieldErrors;
  //   expect(username).toBeDefined();
  //   expect(email).toBeUndefined();
  //   expect(password).toBeUndefined();
  // });
  // test("invalid password", async () => {
  //   const response = await api
  //     .post("/api/auth/signup")
  //     .send(invalidCredentialPassword);
  //   expect(response.status).toBe(400);
  //
  //   expect(response.body.user).toBeUndefined();
  //
  //   const { username, email, password } = response.body.errors.fieldErrors;
  //
  //   expect(password).toBeDefined();
  //   expect(email).toBeUndefined();
  //   expect(username).toBeUndefined();
  // });
});
