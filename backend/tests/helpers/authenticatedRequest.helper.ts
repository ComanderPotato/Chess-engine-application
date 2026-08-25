import request from "supertest";
import { createTestApp } from "../setup/app";
import { getAuth } from "./getAuth.helper";
import { createUser } from "#/factories/user.factory";
import { createSession } from "#/factories/session.factory";

const setup = async () => {
  const app = createTestApp();

  const auth = await getAuth();
  return request.agent(app).set("Cookie", auth.cookie);
};

export const createAuthenticatedRequest = async () => {
  const app = createTestApp();

  const agent = request.agent(app);
  const { user, password } = await createUser();
  await createSession({ userId: user._id });
  await agent
    .post("/api/auth/login")
    .send({ username: user.username, password, rememberMe: true });
  return { agent, user };
};
