import * as userService from "../users/user.service.js";
import * as userSessionService from "../user-sessions/user-session.service.js";
import { IUserSession } from "models/User-Session.model.js";
import { IUser } from "models/User.model.js";
import { hashPassword, verifyPassword } from "./auth.crypto.js";
import { Unauthorized } from "@/shared/errors/client.error.js";
import mongoose from "mongoose";
import {
  AuthResponseDTO,
  LoginUserDTO,
  RegisterUserDTO,
} from "@/shared/types/auth.types.js";
import { UserEntity } from "@/shared/types/user.types.js";
import { UserSessionEntity } from "@/shared/types/user-session.types.js";

export async function authenticateUser(
  credentials: LoginUserDTO,
): Promise<AuthResponseDTO> {
  const { username, password } = credentials;
  const user = await verifyCredentials(username, password);

  if (!user) throw new Unauthorized("Invalid username or password");

  let userSession: UserSessionEntity | null = null;
  let token: string | null = null;
  if (credentials.rememberMe) {
    const results = await userSessionService.createUserSession(user.id);
    userSession = results.userSession;
    token = results.token;
  }

  return { user, userSession, token };
}

async function verifyCredentials(
  username: string,
  password: string,
): Promise<UserEntity | null> {
  const user = await userService.getByUsername(username);

  if (!user) return null;

  const is_valid = await verifyPassword(password, user.passwordHash);

  return is_valid ? user : null;
}

export async function handleSignup(
  credentials: RegisterUserDTO,
): Promise<AuthResponseDTO> {
  const session = await mongoose.startSession();

  try {
    let response: AuthResponseDTO;

    await session.withTransaction(async () => {
      const passwordHash = await hashPassword(credentials.password);

      const user = await userService.createUser(
        {
          username: credentials.username,
          email: credentials.email,
          passwordHash,
        },
        session,
      );

      console.log("Inside transaction");
      const { token, userSession } = await userSessionService.createUserSession(
        user.id,
        session,
      );

      response = {
        user,
        userSession,
        token,
      };
    });

    return response!;
  } finally {
    await session.endSession();
  }
}
export async function handleLogout(token: string) {
  const userSession = await userSessionService.getSessionByToken(token);

  if (!userSession) throw new Unauthorized("User is not logged in");

  await userSessionService.invalidateSession(userSession.id);
}
// Find out where to put this (one fails all fail)
// const session = await mongoose.startSession();
//
// await session.withTransaction(async () => {
//   const user = await UserModel.create([userData], { session });
//
//   const sessionDoc = await SessionModel.create(
//     [{ userId: user[0]._id, tokenHash }],
//     { session }
//   );
// });
