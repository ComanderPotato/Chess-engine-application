import express from "express";
import * as messageController from "./message.controller.js";
import { requireAuth } from "@/shared/middleware/require-auth.middleware.js";

const router = express.Router();

// router.use(requireAuth);
router.get("/", () => undefined);
router.post("/", () => undefined);
router.patch("/:messageId", () => undefined);
// router.get("/me", messageController.getRecentMessages);
// router.get("/me/:id", messageController.getUsersMessages);
// router.post("me/:id", messageController.sendMessage);
export default router;
