export interface IUserCredentials {
  username: string;
  email: string;
  passwordHash: string;
}
export type FriendRequestDirection = "incoming" | "outgoing";
export type FriendRequestAction = "add" | "remove";
