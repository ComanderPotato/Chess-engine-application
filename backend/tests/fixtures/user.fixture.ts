// Fixtures are predefined test data or objects that your tests can reuse.
// They exist to make tests easier to read, easier to maintain, and more
// consistent.

import { CreateUserDTO } from "#/types/user.types";

export const validUser = {
  username: "comander potato",
  email: "tom@test.com",
  password: "Password123",
};

export const validUsername = "comander potato";
export const invalidUsername = "Invalid";

export const validEmail = "tomgolding@test.com";
// export const invalidEmail = "
