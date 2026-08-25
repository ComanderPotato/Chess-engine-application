import { MongoId } from "@/shared/types/data.types.js";
import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface IUserSession {
  userId: Types.ObjectId;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  updatedAt: Date;
}
export const UserSessionSchema = new Schema<IUserSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000),
    },
  },
  { timestamps: true },
);
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const UserSessionModel = model<IUserSession>(
  "Session",
  UserSessionSchema,
);
export type UserSessionDocument = HydratedDocument<IUserSession>;
