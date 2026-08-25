import { generateToken, generateTokenHash } from "@/shared/utils/token.util";
import {
  IUserSession,
  UserSessionDocument,
  UserSessionModel,
} from "models/User-Session.model";
import { Types } from "mongoose";

export async function createUserSession(
  overrides: Partial<IUserSession> = {},
): Promise<{ token: string; userSession: UserSessionDocument }> {
  const token = generateToken();
  const userSession = await UserSessionModel.create({
    userId: new Types.ObjectId(),
    tokenHash: generateTokenHash(token),
    ...overrides,
  });
  return { token, userSession };
}
