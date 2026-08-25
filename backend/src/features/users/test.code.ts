// interface IUserRepository {
//   create(credentials: IUserCredentials): Promise<IUser | null>;
//   findById(userId: string): Promise<IUser | null>;
//   findByUsername(username: string): Promise<IUser | null>;
//   findByEmail(email: string): Promise<IUser | null>;
//
//   checkAvailability(
//     username: string,
//     email: string,
//   ): Promise<{ usernameTaken: boolean; emailTaken: boolean }>;
//
//   deletebyId(userId: string): Promise<boolean>;
//   updateById(userId: string, updates: IUserUpdate): Promise<IUser | null>;
//
//   addFriend(userId: string, friendId: string): Promise<boolean>;
//   removeFriend(userId: string, friendId: string): Promise<boolean>;
//   removeIncomingFriendRequest(
//     userId: string,
//     incomingId: string,
//   ): Promise<boolean>;
//
//   removeoutgoingFriendRequest(
//     userId: string,
//     incomingId: string,
//   ): Promise<boolean>;
//
//   // findFriendIds(userId: string):
// }
// class Singleton<T> {
//   private static instance?: unknown;
//   public static getInstance<T>(create: () => T): T {
//     if (!Singleton.instance) {
//       Singleton.instance = create();
//     }
//
//     return Singleton.instance as T;
//   }
// }
// export class UserRepository
//   extends Singleton<UserRepository>
//   implements IUserRepository
// {
//   create(credentials: IUserCredentials): Promise<IUser | null> {
//     throw new Error("Method not implemented.");
//   }
//   findById(userId: string): Promise<IUser | null> {
//     throw new Error("Method not implemented.");
//   }
//   findByUsername(username: string): Promise<IUser | null> {
//     throw new Error("Method not implemented.");
//   }
//   findByEmail(email: string): Promise<IUser | null> {
//     throw new Error("Method not implemented.");
//   }
//   checkAvailability(
//     username: string,
//     email: string,
//   ): Promise<{ usernameTaken: boolean; emailTaken: boolean }> {
//     throw new Error("Method not implemented.");
//   }
//   deletebyId(userId: string): Promise<boolean> {
//     throw new Error("Method not implemented.");
//   }
//   updateById(userId: string, updates: IUserUpdate): Promise<IUser | null> {
//     throw new Error("Method not implemented.");
//   }
//   addFriend(userId: string, friendId: string): Promise<boolean> {
//     throw new Error("Method not implemented.");
//   }
//   removeFriend(userId: string, friendId: string): Promise<boolean> {
//     throw new Error("Method not implemented.");
//   }
//   removeIncomingFriendRequest(
//     userId: string,
//     incomingId: string,
//   ): Promise<boolean> {
//     throw new Error("Method not implemented.");
//   }
//   removeoutgoingFriendRequest(
//     userId: string,
//     incomingId: string,
//   ): Promise<boolean> {
//     throw new Error("Method not implemented.");
//   }
// }
