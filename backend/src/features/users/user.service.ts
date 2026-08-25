import * as userRepository from "./user.repository.js";
import { BadRequest, Conflict } from "@/shared/errors/client.error.js";
import { IUserCredentials } from "./user.types.js";
import { ClientSession, Types } from "mongoose";
import { Internal } from "@/shared/errors/server.error.js";
import { MongoId } from "@/shared/types/data.types.js";
import { UserEntity } from "@/shared/types/user.types.js";

export async function createUser(
  credentials: IUserCredentials,
  session: ClientSession | null = null,
) {
  const { username, email } = credentials;
  const [isUsernameTaken, isEmailTaken] = await checkCredentialAvailability(
    username,
    email,
    session,
  );

  if (isUsernameTaken && isEmailTaken) {
    throw new BadRequest("Username and email taken");
  } else if (isUsernameTaken) {
    throw new BadRequest("Username taken");
  } else if (isEmailTaken) {
    throw new BadRequest("Email taken");
  }
  return await userRepository.createUser(credentials, session);
}

export async function getById(userId: string): Promise<UserEntity | null> {
  return await userRepository.findById(userId);
}

export async function getByEmail(
  email: string,
  session: ClientSession | null = null,
): Promise<UserEntity | null> {
  return await userRepository.findByEmail(email, session);
}
export async function getByUsername(
  username: string,
  session: ClientSession | null = null,
): Promise<UserEntity | null> {
  return await userRepository.findByUsername(username, session);
}
export async function doesUsernameExist(
  username: string,
  session: ClientSession | null = null,
): Promise<boolean> {
  return (await getByUsername(username, session)) != null;
}
export async function doesEmailExist(
  email: string,
  session: ClientSession | null = null,
): Promise<boolean> {
  return (await getByEmail(email, session)) != null;
}
export async function checkCredentialAvailability(
  username: string,
  email: string,
  session: ClientSession | null = null,
): Promise<[usernameTaken: boolean, emailTaken: boolean]> {
  const usernameTaken = await doesUsernameExist(username, session);
  const emailTaken = await doesEmailExist(email, session);
  return [usernameTaken, emailTaken];
}

export async function populateFriends(id: string) {
  return await userRepository.findFriendsById(id);

  // return await userRepository.findByIds(friendIds);
}

export async function sendFriendRequest(senderId: string, recipientId: string) {
  // Check if neither are friends
  //
  // Add to sender outgoing
  //
  // Add to recipient incoming
}
export async function acceptFriendRequest(
  userId: MongoId,
  requesterId: string,
) {
  const friendIds = await getFriendIds(userId);

  const isAlreadyFriend = friendIds.some(
    (friendId) => friendId === requesterId,
  );
  if (isAlreadyFriend) throw new Conflict("User is already a friend");

  await Promise.all([
    userRepository.removeIncomingFriendRequestById(userId, requesterId),
    userRepository.removeOutgoingFriendRequestById(requesterId, userId),
  ]);
  await Promise.all([
    userRepository.updateFriendsList(userId, requesterId),
    userRepository.updateFriendsList(requesterId, userId),
  ]);
  return await userRepository.findById(userId);
}

export async function getFriendIds(id: MongoId): Promise<MongoId[]> {
  const user = await userRepository.findById(id);
  return user?.friends ?? [];
}

export async function updateElo(
  userId: MongoId,
  updatedElo: number,
): Promise<UserEntity> {
  const updatedUser = await userRepository.updateById(userId, {
    elo: updatedElo,
  });
  if (!updatedUser) throw new Internal("Error updating elo");
  return updatedUser;
}
export async function updateProfilePicture(
  userId: MongoId,
  updatedPictureUrl: string,
): Promise<UserEntity> {
  const updatedUser = await userRepository.updateById(userId, {
    profilePicture: updatedPictureUrl,
  });
  if (!updatedUser) throw new Internal("Error updating profile picture");
  return updatedUser;
}
