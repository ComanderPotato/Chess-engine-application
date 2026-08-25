import { UserDocument, UserModel } from "models/User.model.js";
import { Types } from "mongoose";
import {
  FriendRequestAction,
  FriendRequestDirection,
  IUserCredentials,
} from "./user.types.js";
import { ClientSession } from "mongoose";
import { Internal } from "@/shared/errors/server.error.js";
import { MongoId } from "@/shared/types/data.types.js";
import { UpdateUserDTO } from "@/shared/types/user.types.js";

export async function createUser(
  credentials: IUserCredentials,
  session: ClientSession | null = null,
): Promise<UserDocument> {
  const [user] = await UserModel.create([credentials], { session });
  if (!user) throw new Internal("Error creating user");
  return user;
}
export async function findAll(
  session: ClientSession | null = null,
): Promise<UserDocument[]> {
  return await UserModel.find(undefined, null, { session });
}
export async function findById(
  userId: MongoId,
  session: ClientSession | null = null,
): Promise<UserDocument | null> {
  return await UserModel.findById(userId, null, { session });
}
export async function findByIds(
  ids: MongoId[],
  session: ClientSession | null = null,
): Promise<UserDocument[]> {
  return UserModel.find(
    {
      _id: {
        $in: ids,
      },
    },
    null,
    { session },
  );
}
export async function findByEmail(
  email: string,
  session: ClientSession | null = null,
): Promise<UserDocument | null> {
  return await UserModel.findOne({ email }, null, { session });
}
export async function findByUsername(
  username: string,
  session: ClientSession | null = null,
): Promise<UserDocument | null> {
  session = null;
  return UserModel.findOne({ username }, null, { session });
}
export async function updateById(
  userId: MongoId,
  updates: UpdateUserDTO,
  session: ClientSession | null = null,
): Promise<UserDocument | null> {
  return await UserModel.findByIdAndUpdate(userId, updates, {
    returnDocument: "after", // Returns the updated documents
    runValidators: true, // Mongoose applies schema validation if applicable
    strict: true, // Reject extra fields
    session,
  });
}
export async function deleteById(
  userId: MongoId,
  session: ClientSession | null = null,
): Promise<boolean> {
  const response = await UserModel.deleteOne(
    { _id: userId },
    session ? { session } : undefined,
  );

  return response.deletedCount > 0;
}
export async function checkAvailability(
  username: string,
  email: string,
  session: ClientSession | null = null,
): Promise<{
  usernameTaken: boolean;
  emailTaken: boolean;
}> {
  const user = await UserModel.find(
    { $or: [{ username }, { email }] },
    { session },
  );
  return {
    usernameTaken: user.some((user) => user.username == username),
    emailTaken: user.some((user) => user.email == email),
  };
}

export async function updateFriendsList(
  userId: MongoId,
  newFriendId: MongoId,
  session: ClientSession | null = null,
): Promise<UserDocument | null> {
  return await UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { friends: newFriendId } },
    { returnDocument: "after", session },
  );
}

async function modifyFriendRequestListById(
  userId: MongoId,
  otherUserId: MongoId,
  direction: FriendRequestDirection,
  action: FriendRequestAction,
  session: ClientSession | null = null,
): Promise<boolean> {
  const operator = action === "add" ? "$addToSet" : "$pull";
  const options = {
    timestamps: false,
    ...(session ? { session } : {}),
  };
  const result = await UserModel.updateOne(
    { _id: userId },
    {
      [operator]: {
        [`friendRequests.${direction}`]: otherUserId,
      },
    },
    options,
  );
  return result.modifiedCount > 0; // If user was found, but no change
  // return result.matchedCount > 0; // If user was not found
}
export async function addIncomingFriendRequestById(
  userId: MongoId,
  otherUserId: MongoId,
  session: ClientSession | null = null,
): Promise<boolean> {
  return modifyFriendRequestListById(
    userId,
    otherUserId,
    "incoming",
    "add",
    session,
  );
}
export async function addOutgoingFriendRequestById(
  userId: MongoId,
  otherUserId: MongoId,
  session: ClientSession | null = null,
) {
  return modifyFriendRequestListById(
    userId,
    otherUserId,
    "outgoing",
    "add",
    session,
  );
}
export async function removeIncomingFriendRequestById(
  userId: MongoId,
  otherUserId: MongoId,
  session: ClientSession | null = null,
): Promise<boolean> {
  return modifyFriendRequestListById(
    userId,
    otherUserId,
    "incoming",
    "remove",
    session,
  );
}
export async function removeOutgoingFriendRequestById(
  userId: MongoId,
  otherUserId: MongoId,
  session: ClientSession | null = null,
) {
  return modifyFriendRequestListById(
    userId,
    otherUserId,
    "outgoing",
    "remove",
    session,
  );
}
export type UserWithFriendsDocument = Omit<UserDocument, "friends"> & {
  friends: UserDocument[];
};
export async function findUserWithFriendsById(
  userId: MongoId,
  session: ClientSession | null = null,
): Promise<UserWithFriendsDocument | null> {
  const user = await UserModel.findById(userId, null, session).populate(
    "friends",
  );

  return user as UserWithFriendsDocument | null;
}

export async function findFriendsById(
  userId: MongoId,
  session: ClientSession | null = null,
): Promise<UserDocument[] | null> {
  const user = await findUserWithFriendsById(userId, session);

  if (!user) return null;
  return user.friends ?? [];
}

export async function modifyFriendsList(
  userId: MongoId,
  friendId: MongoId,
  action: FriendRequestAction,
  session: ClientSession | null = null,
): Promise<boolean> {
  const options = {
    timestamps: false,
    ...(session ? { session } : {}),
  };
  const operation = action === "add" ? "$addToSet" : "$pull";
  const response = await UserModel.updateOne(
    {
      _id: userId,
    },
    {
      [operation]: {
        friends: friendId,
      },
    },
    options,
  );
  return response.modifiedCount > 0;
}
export async function removeFriend(
  userId: MongoId,
  friendId: MongoId,
  session: ClientSession | null = null,
) {
  const [responseA, responseB] = await Promise.all([
    modifyFriendsList(userId, friendId, "remove", session),
    modifyFriendsList(friendId, userId, "remove", session),
  ]);
  return responseA && responseB;
}
export async function addFriend(
  userId: MongoId,
  friendId: MongoId,
  session: ClientSession | null = null,
) {
  const [responseA, responseB] = await Promise.all([
    modifyFriendsList(userId, friendId, "add", session),
    modifyFriendsList(friendId, userId, "add", session),
  ]);
  return responseA || responseB;
}
