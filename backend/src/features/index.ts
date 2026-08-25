// import user_router from '../
import express, { Express } from "express";
import authRouter from "./auth/auth.route.js";
import userRouter from "./users/user.route.js";
import gameRouter from "./games/game.route.js";
import conversationRouter from "./conversations/conversation.route.js";
import debugRouter from "./debug/debug.router.js";

const registerRoutes = (app: Express) => {
  const router = express.Router();

  router.use("/auth", authRouter);
  router.use("/users", userRouter);
  router.use("/game", gameRouter);
  router.use("/conversations", conversationRouter);
  app.use("/api", router);
};

export default registerRoutes;
