// import { Board } from "../../board/board.chess.js";
// import { isWhite } from "../../piece/piece.chess.js";
// import {
//   PieceColour as PieceColourConstants,
//   PieceType,
// } from "../../piece/piece.constants.js";
// import { getLSBIndex } from "../../utils/bitboard.utils.js";
// import { getRelevantBlockerSquares } from "../attack/attack.blocker.js";
// import { generatePseudoLegalMoves } from "./move.generator.js";
//
// function generateLegalMoves(board: Board) {
//   const friendlyMoves = generatePseudoLegalMoves(board, board.activeColour);
//   const enemyColour = isWhite(board.activeColour)
//     ? PieceColourConstants.Black
//     : PieceColourConstants.White;
//   const enemyAttackSquares = generatePseudoLegalMoves(
//     board,
//     enemyColour,
//   ).reduce((bb, move) => bb | (1n << BigInt(move.to)), 0n);
//   const kingPosition = getLSBIndex(
//     board.getBitboard(PieceType.King | board.activeColour),
//   );
//   const kingMoves = friendlyMoves
//     .filter((move) => move.from === kingPosition)
//     .reduce((bb, move) => bb | (1n << BigInt(move.to)), 0n);
//
//   const illegalMoves = getRelevantBlockerSquares(
//     kingMoves & enemyAttackSquares,
//   );
//
//   return friendlyMoves.filter((move) =>
//     illegalMoves.some((illegalMove) => move.to !== illegalMove),
//   );
// }
//
// function checkWhereKingCantGo() {}
//
// function kingIsInCheck() {
//   // Single
//   // Move king or capture piece (no moves, checkmate)
//   //
//   // Double
//   // Move king to safety (no moves, checkmate)
// }
//
// // function checkingPins(board: Board, side: typeof PieceColour) {
// // }
//
// // Board single check (move king or take)
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | r | _ | _ | _ | _ | 8
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 7
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 6
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | K | _ | _ | _ | _ | 5
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 4
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 3
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 2
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 1
// // +---+---+---+---+---+---+---+---+
// //   a   b   c   d   e   f   g   h
//
// // Board double check (has to move king)
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | r | _ | _ | _ | _ | 8
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 7
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | n | _ | _ | 6
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | K | _ | _ | _ | _ | 5
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 4
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 3
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 2
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 1
// // +---+---+---+---+---+---+---+---+
// //   a   b   c   d   e   f   g   h
// //
// // Board pin (cant move pinned)
// // +---+---+---+---+---+---+---+---+
// // | b | _ | _ | _ | _ | _ | _ | _ | 8
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 7
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 6
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | P | _ | _ | _ | _ | 5
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 4
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 3
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | K | _ | 2
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 1
// // +---+---+---+---+---+---+---+---+
// //   a   b   c   d   e   f   g   h
// //
// // Board pin (can move pin in direction)
// // +---+---+---+---+---+---+---+---+
// // | b | _ | _ | _ | _ | _ | _ | _ | 8
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 7
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 6
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | B | _ | _ | _ | _ | 5
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 4
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 3
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | K | _ | 2
// // +---+---+---+---+---+---+---+---+
// // | _ | _ | _ | _ | _ | _ | _ | _ | 1
// // +---+---+---+---+---+---+---+---+
// //   a   b   c   d   e   f   g   h
// //
// // Enemy attack Mask
// // +---+---+---+---+---+---+---+---+
// // | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 8
// // +---+---+---+---+---+---+---+---+
// // | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 7
// // +---+---+---+---+---+---+---+---+
// // | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 6
// // +---+---+---+---+---+---+---+---+
// // | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 5
// // +---+---+---+---+---+---+---+---+
// // | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4
// // +---+---+---+---+---+---+---+---+
// // | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3
// // +---+---+---+---+---+---+---+---+
// // | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2
// // +---+---+---+---+---+---+---+---+
// // | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1
// // +---+---+---+---+---+---+---+---+
// //   a   b   c   d   e   f   g   h
//
// // console.log(generatePseudoLegalMoves(board, PieceColourConstants.White).length);
