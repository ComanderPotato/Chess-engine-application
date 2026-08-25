import { beforeEach, describe, expect, it } from "vitest";
import * as userRepository from "@/features/users/user.repository.js";
import {
  createUser,
  createUsers,
  generateValidUser,
} from "#/factories/user.factory.js";
import { UserDocument } from "models/User.model.js";
import {
  generateRandomObjectId,
  generateRandomObjectIds,
  generateValidUserCredentials,
} from "#/helpers/generators.helper.js";
import { assertModel, assertExists } from "#/helpers/assert.js";
import { toObjectId } from "@/shared/utils/objectId.util.js";

describe("User repository", () => {
  describe("create", () => {
    it("creates and returns a user", async () => {
      const credentials = generateValidUser();
      const response = await userRepository.createUser(credentials);
      assertExists(response);
      assertModel(response, credentials, ["username", "email", "passwordHash"]);
    });
  });
  describe("existing user", () => {
    let user: UserDocument;
    let incomingFriend: UserDocument;
    let outgoingFriend: UserDocument;

    let randomId = generateRandomObjectId();
    let randomEmail: string;
    let randomUsername: string;
    let friends: UserDocument[];
    beforeEach(async () => {
      incomingFriend = await createUser();
      outgoingFriend = await createUser();
      friends = await createUsers(10);
      user = await createUser({
        friends: friends.map((friend) => toObjectId(friend.id)),
        friendRequests: {
          incoming: [incomingFriend.id],
          outgoing: [outgoingFriend.id],
        },
      });
      const credentials = generateValidUserCredentials();
      randomEmail = credentials.email;
      randomUsername = credentials.username;
    });
    describe("findById", () => {
      it("returns the user", async () => {
        const response = await userRepository.findById(user.id);
        assertExists(response);
        assertModel(response, user, ["id", "username", "email"]);
      });
      it("returns null when the user does not exist", async () => {
        const response = await userRepository.findById(randomId);
        expect(response).toBeNull();
      });
    });
    describe("findByIds", () => {
      let users: UserDocument[];
      beforeEach(async () => {
        users = await createUsers(10);
      });
      it("returns all matching users", async () => {
        const userIds = users.map((user) => user.id);
        const response = await userRepository.findByIds(userIds);

        expect(response).toHaveLength(userIds.length);

        for (const queriedUser of response) {
          const matchedUser = users.find((user) => user.id === queriedUser.id);
          assertExists(matchedUser);
          assertModel(queriedUser, matchedUser, ["id", "username", "email"]);
        }
      });
      it("returns an empty array when none of the ids exist", async () => {
        const randomIds = generateRandomObjectIds();
        const response = await userRepository.findByIds(randomIds);
        assertExists(response);
        expect(response).toHaveLength(0);
      });
      it("returns only the users that exist", async () => {
        const userIds = users.flatMap((user) => {
          return Math.random() < 0.5
            ? user.id
            : [user.id, generateRandomObjectId()];
        });
        const response = await userRepository.findByIds(userIds);
        assertExists(response);
        expect(response).toHaveLength(users.length);
        for (const queriedUser of response) {
          const matchedUser = users.find((user) => user.id === queriedUser.id);
          assertExists(matchedUser);
          assertModel(queriedUser, matchedUser, ["id", "username", "email"]);
        }
      });
    });
    describe("findByEmail", () => {
      it("returns the user", async () => {
        const response = await userRepository.findByEmail(user.email);
        assertExists(response);
        assertModel(response, user, ["id", "username", "email"]);
      });
      it("returns null when the user does not exist", async () => {
        const response = await userRepository.findByEmail(randomEmail);
        expect(response).toBeNull();
      });
    });
    describe("findByUsername", () => {
      it("returns the user", async () => {
        const response = await userRepository.findByUsername(user.username);
        assertExists(response);
        assertModel(response, user, ["id", "username", "email"]);
      });
      it("returns null when the user does not exist", async () => {
        const response = await userRepository.findByUsername(randomUsername);
        expect(response).toBeNull();
      });
    });
    // describe("updateById", () => {
    //   const updates: Partial<IUserUpdate> = {
    //     firstName: "Tom",
    //     lastName: "Golding",
    //     country: "Australia",
    //   };
    //   it("returns the updated user", async () => {
    //     const response = await userRepository.updateById(user.id, updates);
    //     assertExists(response);
    //     assertModel(response, user, ["id", "username", "email"]);
    //     assertModel(response, updates, ["firstName", "lastName", "country"]);
    //   });
    //   it("returns null when the user does not exist", async () => {
    //     const response = await userRepository.updateById(randomId, updates);
    //     expect(response).toBeNull();
    //   });
    // });

    describe("addFriend", () => {
      let userA: UserDocument;
      let userB: UserDocument;
      let addFriendAToB = false;
      beforeEach(async () => {
        userA = await createUser();
        userB = await createUser(
          addFriendAToB ? { friends: [toObjectId(userA.id)] } : {},
        );
        addFriendAToB = !addFriendAToB;
      });
      it("returns true if id's were added to users friends list", async () => {
        const response = await userRepository.addFriend(userA.id, userB.id);
        expect(response).toBe(true);

        const fetchedUserA = await userRepository.findById(userA.id);
        const fetchedUserB = await userRepository.findById(userB.id);

        assertExists(fetchedUserA);
        assertExists(fetchedUserB);
        expect(fetchedUserA.friends.some((id) => id.equals(userB.id))).toBe(
          true,
        );
        expect(fetchedUserB.friends.some((id) => id.equals(userA.id))).toBe(
          true,
        );
      });
      it("returns true if only one user's friends list needed updating", async () => {
        const response = await userRepository.addFriend(userA.id, userB.id);
        expect(response).toBe(true);
      });
      it("returns false if users were already friends", async () => {
        const responseA = await userRepository.addFriend(userA.id, userB.id);
        expect(responseA).toBe(true);
        const responseB = await userRepository.addFriend(userA.id, userB.id);
        expect(responseB).toBe(false);
      });
    });
    describe("findUserWithFriendsById", () => {
      it("returns the user with populated friends list", async () => {
        const response = await userRepository.findUserWithFriendsById(user.id);

        assertExists(response);
        for (const queriedUser of response.friends) {
          const matchedUser = friends.find(
            (user) => user.id === queriedUser.id,
          );
          assertExists(matchedUser);
          assertModel(queriedUser, matchedUser!, ["id", "username", "email"]);
        }
      });
      it("returns the user with an empty friends array when the user has no friends", async () => {
        const response = await userRepository.findUserWithFriendsById(
          incomingFriend.id,
        );

        assertExists(response);
        expect(response.friends).toHaveLength(0);
      });
      it("returns null when the user does not exist", async () => {
        const response = await userRepository.findUserWithFriendsById(randomId);
        expect(response).toBeNull();
      });
    });
    describe("findFriendsById", () => {
      it("returns the users populated friends list", async () => {
        const response = await userRepository.findFriendsById(user.id);

        assertExists(response);
        expect(response).toHaveLength(friends.length);
        for (const queriedUser of response!) {
          const matchedUser = friends.find(
            (user) => user.id === queriedUser.id,
          );
          expect(matchedUser).not.toBeNull();
          assertModel(queriedUser, matchedUser!, ["id", "username", "email"]);
        }
      });
      it("returns an empty array when user has no friends", async () => {
        let response = await userRepository.findFriendsById(incomingFriend.id);

        assertExists(response);
        expect(response).toHaveLength(0);
      });
      it("returns null when the user does not exist", async () => {
        const response = await userRepository.findFriendsById(randomId);

        expect(response).toBeNull();
      });
    });
    // Friend Updates
    describe("addIncomingFriendRequestById", () => {
      it("returns true if the id was added to the incoming array", async () => {
        const response = await userRepository.addIncomingFriendRequestById(
          user.id,
          generateRandomObjectId(),
        );

        expect(response).toBe(true);
      });
      it("returns false if incoming array contains the id", async () => {
        const response = await userRepository.addIncomingFriendRequestById(
          user.id,
          incomingFriend.id,
        );

        expect(response).toBe(false);
      });
    });
    describe("removeIncomingFriendRequestById", () => {
      it("returns true if the id was removed from the incoming array", async () => {
        const response = await userRepository.removeIncomingFriendRequestById(
          user.id,
          incomingFriend.id,
        );

        expect(response).toBe(true);
      });
      it("returns false if incoming array doesn't contain the id", async () => {
        const response = await userRepository.removeIncomingFriendRequestById(
          user.id,
          generateRandomObjectId(),
        );

        expect(response).toBe(false);
      });
    });
    describe("addOutgoingFriendRequestById", () => {
      it("returns true if the id was added to the outgoing array", async () => {
        const response = await userRepository.addOutgoingFriendRequestById(
          user.id,
          generateRandomObjectId(),
        );

        expect(response).toBe(true);
      });
      it("returns false if outgoing array contains the id", async () => {
        const response = await userRepository.addOutgoingFriendRequestById(
          user.id,
          outgoingFriend.id,
        );

        expect(response).toBe(false);
      });
    });
    describe("removeOutgoingFriendRequestById", () => {
      it("returns true if the id was removed from the outgoing array", async () => {
        const response = await userRepository.removeOutgoingFriendRequestById(
          user.id,
          outgoingFriend.id,
        );

        expect(response).toBe(true);
      });
      it("returns false if outgoing array doesn't contain the id", async () => {
        const response = await userRepository.removeOutgoingFriendRequestById(
          user.id,
          generateRandomObjectId(),
        );

        expect(response).toBe(false);
      });
    });

    describe("deleteById", () => {
      it("returns true if the user was deleted", async () => {
        const response = await userRepository.deleteById(user.id);
        expect(response).toBe(true);
      });
      it("returns false if the user does not exist", async () => {
        const response = await userRepository.deleteById(randomId);
        expect(response).toBe(false);
      });
    });
  });
});
