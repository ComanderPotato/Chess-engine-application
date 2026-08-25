import { Next, Req, Res } from "../types/express.types.js";
import * as userService from "@/features/users/user.service.js";

export async function bypassAuth(req: Req, res: Res, next: Next) {
  if (!req.headers["authorization"]) return next();
  const authHeader = req.headers["authorization"]!;

  // 1. Remove the "Basic " prefix
  const base64Token: string = authHeader.split(" ")[1]!;

  // 2. Decode the Base64 string using the browser-native atob()
  const decodedCredentials = atob(base64Token); // Result: "username:password123"

  // 3. Split the string by the first colon to get username and password
  const [username, password] = decodedCredentials.split(":");
  const user = await userService.getByUsername(username!);
  res.locals.user = user;
  next();
}
