import { IMove } from "models/Move.model";
import { Types } from "mongoose";

export interface CreateSessionDTO {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
}
