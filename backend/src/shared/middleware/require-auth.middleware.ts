import { Req, Res, Next } from "../types/express.types.js";
import * as userSessionService from "@/features/user-sessions/user-session.service.js";
import * as userService from "@/features/users/user.service.js";

export async function requireAuth(req: Req, res: Res, next: Next) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    next();
    return;
  }
  const session = await userSessionService.getSessionByToken(sessionId);
  if (!session) {
    next();
    return;
  }
  const user = await userService.getById(session.userId.toString());
  res.locals.user = user;
  next();
}
