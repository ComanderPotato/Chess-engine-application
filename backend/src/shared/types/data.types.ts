import { Types } from "mongoose";

export type MongoId = string | Types.ObjectId;
export type UserId = MongoId & {
  readonly __brand: "UserId";
};
