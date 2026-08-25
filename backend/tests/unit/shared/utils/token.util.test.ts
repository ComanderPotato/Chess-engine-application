import { generateToken, generateTokenHash } from "@/shared/utils/token.util";
import crypto from "crypto";
import { describe, expect, it } from "vitest";
//
// describe("Token generation", () => {
//   it("tests a token is generated", () => {
//     const token = generateToken();
//     expect(token).toBe(String);
//   });
// });
