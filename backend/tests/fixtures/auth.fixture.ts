export const validUserCredentials = {
  username: "comander potato",
  email: "tom@test.com",
  password: "Password123",
};

export const invalidCredentialUsername = {
  username: "tom", // Less than 8
  email: "tom@test.com",
  password: "Password123", // No capital letter
};
export const invalidCredentialPassword = {
  username: "comander potato",
  email: "tom@test.com",
  password: "password123", // No capital letter
};
