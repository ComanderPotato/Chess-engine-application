import { createSession } from "#/factories/session.factory";
import { createUser } from "#/factories/user.factory";

export async function getAuth() {
  const { user } = await createUser();
  const { token, session } = await createSession({
    userId: user._id,
  });

  return {
    user,
    session,
    token,
    cookie: `sessionId=${token}`,
  };
}
