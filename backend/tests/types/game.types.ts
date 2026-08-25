// DTO = data transfer object
import { IMove } from "models/Move.model";
import { Types } from "mongoose";

export interface CreateGameDTO {
  whitePlayer: Types.ObjectId;
  blackPlayer: Types.ObjectId;
  winner: Types.ObjectId | null;

  moves: IMove[];

  startingFen: string;
  currentBoard: string;
}
