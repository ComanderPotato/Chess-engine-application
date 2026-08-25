import { Schema, model, Types, HydratedDocument } from "mongoose";
import {
  FriendRequestSchema,
  IFriendRequests,
} from "./FriendRequests.model.js";
import { MongoId } from "@/shared/types/data.types.js";

export interface IUser {
  username: string;
  email: string;
  passwordHash: string;

  firstName: string;
  lastName: string;
  profilePicture: string;

  friends: Types.ObjectId[];
  elo: number;
  country: string;

  friendRequests: IFriendRequests;

  createdAt: Date;
  updatedAt: Date;
}
export const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    elo: { type: Number, default: 500 },
    country: { type: String, default: "" },
    friendRequests: {
      type: FriendRequestSchema,
      default: () => ({ incoming: [], outgoing: [] }),
    },
  },
  { timestamps: true },
);

export const UserModel = model<IUser>("User", UserSchema);
export type UserDocument = HydratedDocument<IUser>;
