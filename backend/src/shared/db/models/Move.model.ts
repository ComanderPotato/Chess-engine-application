import { Schema } from "mongoose";

export interface IMove {
  from: string;
  to: string;
  san?: string; // optional algebraic notation
  fenAfter: string;
  playedAt: Date;
}
export const MoveSchema = new Schema<IMove>(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    san: { type: String },
    fenAfter: { type: String, required: true },
    playedAt: { type: Date, default: Date.now },
  },
  { _id: false }, // important: embedded subdocuments don't need their own IDs
);
