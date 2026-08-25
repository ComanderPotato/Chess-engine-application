import express from "express";
import * as gameController from "./game.controller.js";
import { requireAuth } from "@/shared/middleware/require-auth.middleware.js";

const router = express.Router();

router.get("/", gameController.getGames);
router.post("/", gameController.createGame);

router.get("/:gameId", gameController.getGame);
router.patch("/:gameId", gameController.updateGameState);
router.delete("/:gameId", gameController.removeGame);
router.get("/:gameId/moves", gameController.getGameMoves);
router.post("/:gameId/moves", gameController.addMove);

export default router;
