import express from "express";
import * as notificationController from "./notification.controller.js";
import { requireAuth } from "@/shared/middleware/require-auth.middleware.js";

const router = express.Router();

// Public user resources

// Admin / pub/sub
router.post("/", notificationController.createNotification);

router.use(requireAuth);
router.get("/", notificationController.getNotifications);
router.patch("/:notificationId", notificationController.updateNotification);
router.delete("/:notificationId", notificationController.deleteNotification);

// For admin role
export default router;
