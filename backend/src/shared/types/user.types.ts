import { IFriendRequests } from "models/FriendRequests.model.js";
import { IUser } from "models/User.model.js";
import { Types } from "mongoose";

export interface UserEntity extends IUser {
  id: string;
}
export interface CreateUserDTO {
  username: string;
  email: string;
  passwordHash: string;

  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  friends?: Types.ObjectId[];
  elo?: number;
  country?: string;
  friendRequests?: IFriendRequests;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  country?: string;
  elo?: number;
}
