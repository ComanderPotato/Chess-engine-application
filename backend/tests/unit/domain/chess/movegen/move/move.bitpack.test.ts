// import {
//   createMoveBitpack,
//   getFrom,
//   getTo,
// } from "@/domain/chess/movegen/move/move.bitpack.js";
// import MoveFlag from "@/domain/chess/movegen/move/move.types.js";
// import { describe, expect, it } from "vitest";
//
// describe("Move bitpack", () => {
//   it("creates a move bitpack", () => {
//     const move = createMoveBitpack(2, 10, MoveFlag.Quiet);
//     expect(move).toBeTypeOf("number");
//   });
//   it("throws on invalid squares", () => {
//     expect(() => createMoveBitpack(2, 20, MoveFlag.QueenCastle)).throw();
//   });
//   it("gets from square", () => {
//     let move = createMoveBitpack(2, 10, MoveFlag.Quiet);
//     expect(getFrom(move)).toBe(2);
//     expect(getTo(move)).toBe(10);
//
//     move = createMoveBitpack(2, 10, MoveFlag.Quiet);
//     expect(getFrom(move)).toBe(2);
//     expect(getTo(move)).toBe(10);
//   });
// });
