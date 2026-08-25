import { Types } from "mongoose";

export function toObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}
export function toId(id: Types.ObjectId): string {
  return id.toString();
}
