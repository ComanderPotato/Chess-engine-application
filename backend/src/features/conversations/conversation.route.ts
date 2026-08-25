// @ts-nocheck
import express from "express";
import * as conversationController from "./conversation.controller.js";
import { requireAuth } from "@/shared/middleware/require-auth.middleware.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", conversationController.getMyConversations);

// Maybe don't need
router.post("/", conversationController.startConversation);

router.get("/:conversationId", conversationController.getConversation);

router.get(
  "/:conversationId/messages",
  conversationController.getConversationMessages,
);

router.post("/:conversationId/messages", conversationController.sendMessage);

// router.get(
//   "/:conversationId/participants",
//   conversationController.getParticipants,
// );
//
// router.post(
//   "/:conversationId/participants",
//   conversationController.addParticipant,
// );
// router.delete(
//   "/:conversationId/participants/:participantId",
//   conversationController.removeParticipant,
// );

export default router;
