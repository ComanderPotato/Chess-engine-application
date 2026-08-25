import { Req, Res, Next } from "@/shared/types/express.types.js";
import * as authService from "./auth.service.js";
import { LoginUserDTO, RegisterUserDTO } from "@/shared/types/auth.types.js";

export async function login(req: Req<{}, LoginUserDTO>, res: Res) {
  const {
    user,
    userSession: session,
    token,
  } = await authService.authenticateUser(req.body);

  res.cookie("sessionId", token);
  res.status(200).json({ user: user });
}
export async function signup(req: Req<{}, RegisterUserDTO>, res: Res) {
  const {
    user,
    userSession: session,
    token,
  } = await authService.handleSignup(req.body);
  res.cookie("sessionId", token);
  res.status(201).json({ user: user });
}
export async function logout(req: Req, res: Res) {
  const userSessionId = req.cookies.userSessionId;
  await authService.handleLogout(userSessionId);
  res.status(204).send();
}
