import {
  generateRandomObjectId,
  generateValidEmail,
  generateValidUserCredentials,
  generateValidUsername,
} from "#/helpers/generators.helper";
import { hashPassword } from "@/features/auth/auth.crypto";
import {
  IUserCreate,
  UserDocument,
  UserModel,
} from "@/shared/db/models/User.model";

export function generateValidUser(
  overrides: Partial<IUserCreate> = {},
): IUserCreate {
  return {
    username: generateValidUsername(),
    email: generateValidEmail(),
    passwordHash: "test-hash",

    ...overrides,
  };
}
export async function createUser(
  overrides: Partial<IUserCreate> = {},
): Promise<UserDocument> {
  return await UserModel.create(generateValidUser(overrides));
}
// export async function createUser(
//   overrides: Partial<IUserCreate> = {},
//   password: string = "Password123",
// ): Promise<{ user: UserDocument; password: string }> {
//   const user = await UserModel.create({
//     ...generateValidUser(overrides),
//   });
//   return { user, password };
// }

export async function createUsers(count = 2): Promise<UserDocument[]> {
  const users = Array.from({ length: count }, () => generateValidUser());

  return (await UserModel.insertMany(users)) as UserDocument[];
}
