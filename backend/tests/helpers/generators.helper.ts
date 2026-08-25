import { Types } from "mongoose";
import crypto from "crypto";
import {
  formatInvalidEmail,
  formatValidEmail,
  formatValidUsername,
} from "./formatters.helper";

const DEFAULT_USERNAME = "comander potato";
const DEFAULT_EMAIL = "tom@test.com";

export function generateRandomObjectId() {
  return new Types.ObjectId();
}
export function generateRandomObjectIds(count: number = 2) {
  return Array.from({ length: count }, () => generateRandomObjectId());
}

export function generateRandomToken(size: number = 32): string {
  return crypto.randomBytes(size).toString("hex");
}
export function generateRandomTokenHash(): string {
  const token = generateRandomToken();
  return crypto.createHash("sha256").update(token).digest("hex");
}
export function generateRandomPassword(): string {
  return generateRandomToken(8);
}

export function generateRandomName(): {
  firstName: string;
  lastName: string;
} {
  const firstNames = [
    "John",
    "Jane",
    "Alex",
    "Tom",
    "Jeremy",
    "Bob",
    "Jess",
    "Connor",
    "Jared",
    "James",
    "Cameron",
    "Murray",
    "Simon",
  ];
  const lastNames = [
    "Smith",
    "Brown",
    "Taylor",
    "Golding",
    "Wright",
    "Davis",
    "West",
    "Southall",
    "Bocking",
    "OHeir",
  ];

  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)]!,
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)]!,
  };
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
}
export function generateValidUserCredentials(): {
  username: string;
  email: string;
} {
  const { firstName, lastName } = generateRandomName();
  return {
    username: formatValidUsername(firstName, lastName),
    email: formatInvalidEmail(firstName, lastName),
  };
}
export function generateValidUsername(): string {
  return generateValidUserCredentials().username;
}
export function generateValidEmail(): string {
  return generateValidUserCredentials().email;
}
