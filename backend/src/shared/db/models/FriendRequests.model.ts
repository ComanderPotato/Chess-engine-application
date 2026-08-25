import { MongoId } from "@/shared/types/data.types.js";
import { Schema, model, Types } from "mongoose";

export interface IFriendRequests {
  incoming: MongoId[];
  outgoing: MongoId[];
}

export const FriendRequestSchema = new Schema<IFriendRequests>(
  {
    incoming: [{ type: Schema.Types.ObjectId, ref: "User" }],
    outgoing: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: false },
);

export interface IFriendRequest {
  createdAt: Date;
}
