import { Schema, model, Types } from "mongoose";
import { IMove, MoveSchema } from "./Move.model.js";

export interface IGame {
  whitePlayer: Types.ObjectId;
  blackPlayer: Types.ObjectId;
  winner?: Types.ObjectId | null;

  moves: IMove[];

  startingFEN: string;
  currentBoard: string; // FEN

  result?: "white" | "black" | "draw" | null;

  createdAt: Date;
  updatedAt: Date;
}

export const GameSchema = new Schema<IGame>(
  {
    whitePlayer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    blackPlayer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    winner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    moves: {
      type: [MoveSchema],
      default: [],
    },

    startingFEN: {
      type: String,
      default: "startpos", // or full initial FEN string
    },

    currentBoard: {
      type: String,
      required: true,
    },

    result: {
      type: String,
      enum: ["white", "black", "draw"],
      default: null,
    },
  },
  { timestamps: true },
);

export const GameModel = model<IGame>("Game", GameSchema);
