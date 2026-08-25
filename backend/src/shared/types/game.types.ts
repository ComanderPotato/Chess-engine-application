import { IGame } from "models/Game.model.js";
import { IMove } from "models/Move.model.js";
import { Types } from "mongoose";

export interface GameEntity extends IGame {
  id: string;
}

export interface CreateGameDTO {
  whitePlayer: Types.ObjectId;
  blackPlayer: Types.ObjectId;
}

export interface UpdateGameDTO {
  winner?: Types.ObjectId;
  moves?: IMove[];
  currentBoard: string;
  result?: "white" | "black" | "draw";
}
