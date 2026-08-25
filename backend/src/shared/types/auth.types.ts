import { UserSessionDocument } from "models/User-Session.model.js";
import { UserDocument } from "models/User.model.js";
import { UserSessionEntity } from "./user-session.types.js";
import { UserEntity } from "./user.types.js";

export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
}
export interface AuthResponseDTO {
  user: UserEntity;
  userSession: UserSessionEntity | null;
  token: string | null;
}
export interface LoginUserDTO {
  username: string;
  password: string;
  rememberMe: boolean;
}
