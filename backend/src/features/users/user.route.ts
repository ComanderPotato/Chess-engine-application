import express from "express";
import * as userController from "./user.controller.js";
import { requireAuth } from "@/shared/middleware/require-auth.middleware.js";

const router = express.Router();

// Public user resources
//
// const dummy = (req: any, res: any) => undefined;
//
// // For admin role
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: res.locals.user });
});
// router.get("/", userController.getUsers); // Get user
// router.post("/", userController.createUser); // Update user
//
// router.get("/:userId", userController.getUsersPublicProfile); // Get user
// router.get("/:userId/friends", userController.getUsersFriends); // Get friends
// router.post("/:userId/friends", userController.sendFriendRequest); // Update friends (add)
//
// const authenticatedRouter = express.Router();
// authenticatedRouter.use(requireAuth);
// router.get("/me", userController.getMe);
// router.patch("/me", userController.updateMe); // Update user
// router.delete("/me", userController.deleteMe); // Delete user
// router.get("/me/notifications", userController.getMyNotifications); // Get user notifications
// router.post("/me/notifications", userController.createNotification); // Create user notifications pub/sub
// router.patch("/me/notifications", userController.readNotification); // Create user notifications pub/sub
// router.delete(
//   "/me/notifications/:notificationId",
//   userController.deleteNotification,
// );
// router.get("/me/settings", userController.getMySettings); // Get user settings
// router.patch("/me/settings", userController.updateMySettings); // Update user settings

export default router;
