//@ts-nocheck
// import * as userService from "./user.service.js";
// import { Next, Req, Res } from "@/shared/types/express.types.js";
//
// export async function getUsers(req: Req, res: Res) {
//   const users = await userService.getUsers();
// }
//
// export async function createUser(req: Req, res: Res) {
//   const users = await userService.getUsers();
// }
//
// export async function getUsersPublicProfile(
//   req: Req<{ userId: string }>,
//   res: Res,
// ) {
//   const users = await userService.getUser(req.params.userId);
// }
//
// export function getUsersFriends(req: Req<{ userId: string }>, res: Res) {
//   const users = await userService.getUser(req.params.userId);
// }
//
// export function sendFriendRequest(req: Req<{ userId: string }>, res: Res) {
//   const users = await userService.sendFriendRequest(req.params.userId);
// }
//
// export function getMe(req: Req, res: Res) {
//   const id = res.locals.user.id;
//   const users = await userService.getMyProfile(req.params.userId);
// }
//
// export function updateMe(req: Req, res: Res) {
//   const id = res.locals.user.id;
//   const users = await userService.updateMyProfile(id);
// }
//
// export function deleteMe(req: Req, res: Res) {
//   const id = res.locals.user.id;
//   const users = await userService.deleteMyProfile(id);
// }
//
// export function getMyNotifications(req: Req, res: Res) {
//   const id = res.locals.user.id;
//   const users = await userService.deleteMyProfile(id);
// }
//
// export function createNotification(req: Req, res: Res) {}
//
// export function readNotification(req: Req, res: Res) {
//   await userService.markNotificationAsRead();
// }
// export function deleteNotification(req: Req, res: Res) {}
//
// export function getMySettings(req: Req, res: Res) {}
//
// export function updateMySettings(req: Req, res: Res) {}
// export async function getMe(req: Request, res: Res) {
//   res.json(res.locals.user);
// }
//
// export async function updateMe(req: Req, res: Res) {}
//
// export async function deleteMe(req: Req, res: Res) {}
//
// export async function getUsersFriends(
//   req: Req<{ id: string }>,
//   res: Res,
//   next: Next,
// ) {
//   if (!req.params.id || res.locals.user.id == req.params.id) {
//     return next("route");
//   }
//   console.log("Balls");
//   const friends = await userService.populateFriends(req.params.id);
//   res.json(friends);
// }
// export async function getMyFriends(req: Req, res: Res) {
//   const friends = await userService.populateFriends(res.locals.user.id);
//   res.json(friends);
// }
//
// export async function getUser(req: Req, res: Res) {}
// export async function getMySettings(req: Req, res: Res) {}
// export async function getMyNotifications(req: Req, res: Res) {}
// export async function getMyNotificationById(req: Req, res: Res) {}
