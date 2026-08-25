import { generateToken, generateTokenHash } from "@/shared/utils/token.util.js";
import * as userSessionRepository from "./user-session.repository.js";
import { ClientSession } from "mongoose";
import { Unauthorized } from "@/shared/errors/client.error.js";
import { Internal } from "@/shared/errors/server.error.js";
import { UserSessionEntity } from "@/shared/types/user-session.types.js";

export async function getSessionByToken(
  token: string,
  session: ClientSession | null = null,
): Promise<UserSessionEntity | null> {
  const tokenHash = generateTokenHash(token);
  return await userSessionRepository.findByTokenHash(tokenHash, session);
}
export async function createUserSession(
  userId: string,
  session: ClientSession | null = null,
): Promise<{ token: string; userSession: UserSessionEntity }> {
  const token = generateToken();
  const userSession = await userSessionRepository.create(
    userId,
    generateTokenHash(token),
    session,
  );

  return { token, userSession };
}
export async function invalidateSession(
  userSessionId: string,
  session: ClientSession | null = null,
): Promise<void> {
  const wasDeleted = await userSessionRepository.deleteById(
    userSessionId,
    session,
  );
  if (!wasDeleted) throw new Internal("Failed to invalidate session");
}
