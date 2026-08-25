import { IUserSession } from "models/User-Session.model.js";
import { Types } from "mongoose";

export interface UserSessionEntity extends IUserSession {
  id: string;
}
export interface CreateUserSessionDTO {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
}

export interface UpdateUserSessionDTO {
  expiresAt?: Date;
}
