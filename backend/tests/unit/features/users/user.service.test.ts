import { createUser, createUsers } from "#/factories/user.factory.js";
import { assertModel } from "#/helpers/assert.js";
import { generateRandomObjectId } from "#/helpers/generators.helper.js";
import * as userService from "@/features/users/user.service.js";
import { IUser } from "models/User.model.js";
import { beforeEach, describe, expect, it } from "vitest";

describe("User service", () => {
  describe("Creating a user", () => {
    it("registers a user with valid credentials", () => {});
  });

  describe.only("Find user's friends", () => {
    let user: IUser;
    beforeEach(async () => {
      const friends = await createUsers(10);
      const createdUser = await createUser({
        friends: friends.map((friend) => friend.id),
      });
      user = createdUser.user;
    });

    it("test", async () => {
      const a = await userService.getById(user.id);
      const b = await userService.populateFriends(user.id);
      console.log(a);
      console.log(b);
    });
  });
  describe("Find user", () => {
    let user: IUser;
    beforeEach(async () => {
      const createdUser = await createUser();
      user = createdUser.user;
    });

    describe("by id", () => {
      it("returns the user with the given id", async () => {
        const foundUser = await userService.getById(user.id);
        expect(foundUser).not.toBeNull();
        assertModel(user, foundUser!, ["id", "email", "username"]);
      });
      it("returns null when the user does not exist", async () => {
        const foundUser = await userService.getById(
          generateRandomObjectId().toString(),
        );
        expect(foundUser).toBeNull();
      });
    });
    describe("by email", () => {
      it("returns the user with the given email", async () => {
        const foundUser = await userService.getByEmail(user.email);
        expect(foundUser).not.toBeNull();
        assertModel(user, foundUser!, ["id", "email", "username"]);
      });
      it("returns null when the user does not exist", async () => {
        const foundUser = await userService.getByEmail("RandomEmail@test.com");
        expect(foundUser).toBeNull();
      });
    });
    describe("by username", () => {
      it("returns the user with the given username", async () => {
        const foundUser = await userService.getByUsername(user.username);
        expect(foundUser).not.toBeNull();
        assertModel(user, foundUser!, ["id", "email", "username"]);
      });
      it("returns null when the user does not exist", async () => {
        const foundUser = await userService.getByUsername("Random username");
        expect(foundUser).toBeNull();
      });
    });
  });
  describe("Check if user exists", () => {
    let user: IUser;
    beforeEach(async () => {
      const createdUser = await createUser();
      user = createdUser.user;
    });
    describe("By email", () => {
      it("returns true that user exists", async () => {
        const foundUser = await userService.doesEmailExist(user.email);
        expect(foundUser).toBe(true);
      });
      it("returns false that user exists", async () => {
        const foundUser = await userService.doesEmailExist(
          "RandomEmail@test.com",
        );
        expect(foundUser).toBe(false);
      });
    });
    describe("By username", () => {
      it("returns true that user exists", async () => {
        const foundUser = await userService.doesUsernameExist(user.username);
        expect(foundUser).toBe(true);
      });
      it("returns false that user exists", async () => {
        const foundUser = await userService.doesUsernameExist(
          "RandomEmail@test.com",
        );
        expect(foundUser).toBe(false);
      });
    });
    describe("By email and username", () => {
      it("returns true for email and username", async () => {
        const [usernameTaken, emailTaken] =
          await userService.checkCredentialAvailability(
            user.username,
            user.email,
          );
        expect(usernameTaken).toBe(true);
        expect(emailTaken).toBe(true);
      });
      it("returns true for email and false for username", async () => {
        const [usernameTaken, emailTaken] =
          await userService.checkCredentialAvailability(
            "DummyUsername",
            user.email,
          );
        expect(usernameTaken).toBe(false);
        expect(emailTaken).toBe(true);
      });
      it("returns false for email and true for username", async () => {
        const [usernameTaken, emailTaken] =
          await userService.checkCredentialAvailability(
            user.username,
            "dummy@test.com",
          );
        expect(usernameTaken).toBe(true);
        expect(emailTaken).toBe(false);
      });
      it("returns false for email and username", async () => {
        const [usernameTaken, emailTaken] =
          await userService.checkCredentialAvailability(
            "DummyUsername",
            "dummy@test.com",
          );
        expect(usernameTaken).toBe(false);
        expect(emailTaken).toBe(false);
      });
    });
  });
});
