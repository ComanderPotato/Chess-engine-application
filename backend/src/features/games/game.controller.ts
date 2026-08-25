// @ts-nocheck

import { Next, Req, Res } from "@/shared/types/express.types.js";

import { createUser } from "@/features/users/user.repository.js";

export async function getGames(req: Req, res: Res) {}

export async function createGame(req: Req, res: Res) {
  const game = await gameService.createGame();
  res.status(201).json({ message: "Not done" });
}

export async function getGame(req: Req, res: Res) {
  res.json(res.locals.user);
}

export async function updateGameState(req: Req, res: Res) {}

export async function removeGame(req: Req, res: Res) {}

export async function getGameMoves(req: Req, res: Res) {}

export async function addMove(req: Req, res: Res) {}
