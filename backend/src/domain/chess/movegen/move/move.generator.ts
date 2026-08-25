// import { generateFileMask } from "@/domain/chess/bitboard/bitboard.generators.js";
// import {
//   STARTING_BLACK_PAWNS_MASK,
//   STARTING_WHITE_PAWNS_MASK,
// } from "@/domain/chess/bitboard/bitboard.masks.js";
// import { Board } from "../../board/board.chess.js";
// import {
//   Bitboard,
//   ReadonlyBitboards,
//   Square,
// } from "../../board/types.chess.js";
// import { getColour, isWhite } from "../../piece/piece.chess.js";
// import { PieceType as PieceTypeConstants } from "../../piece/piece.constants.js";
// import { pieceToNotation } from "../../piece/piece.notation.js";
// import { Piece, PieceColour } from "../../piece/piece.types.js";
// import { clearBit64, isBitSet64 } from "../../utils/bit.utils.js";
// import { getLSBIndex, clearLSB } from "../../utils/bitboard.utils.js";
// import { squareToCoord } from "../../utils/coord.utils.js";
// import { computeIndex } from "../../utils/magic.utils.js";
// import { toFile } from "../../utils/square.utils.js";
// import {
//   DIAGONAL_TABLES,
//   BLACK_PAWN_ATTACKS,
//   KING_ATTACKS,
//   KNIGHT_ATTACKS,
//   ORTHOGONAL_TABLES,
//   WHITE_PAWN_ATTACKS,
//   SlidingTables,
// } from "../attack/attack.tables.js";
// import { BITBOARD_SHIFTS } from "./move.directions.js";
// import { MoveFlag, Move } from "./move.types.js";
//
// function getMoveFlag(board: Board, to: Square): MoveFlag {
//   if (isBitSet64(board.occupancy, to)) {
//     return MoveFlag.Capture;
//   }
//   return MoveFlag.Quiet;
// }
//
// function createMove(board: Board, from: Square, to: Square): Move {
//   if (to === null) console.log(pieceToNotation(board.pieceAt(from)), to);
//   return {
//     from,
//     to,
//     fromSquare: squareToCoord(from),
//     toSquare: squareToCoord(to),
//     flag: getMoveFlag(board, to),
//     piece: pieceToNotation(board.pieceAt(from)),
//   };
// }
// function generatePawnMoveBoard(
//   pawnBoard: Bitboard,
//   occupancy: Bitboard,
//   side: PieceColour,
// ): Bitboard {
//   const STARTING_RANK = isWhite(side)
//     ? STARTING_WHITE_PAWNS_MASK
//     : STARTING_BLACK_PAWNS_MASK;
//   const direction = isWhite(side) ? BITBOARD_SHIFTS.N : BITBOARD_SHIFTS.S;
//
//   if (isWhite(side)) {
//     const singlePush = (pawnBoard << direction) & ~occupancy;
//     const doublePush =
//       (((STARTING_RANK << direction) & singlePush) << direction) & ~occupancy;
//     return singlePush | doublePush;
//   } else {
//     const singlePush = (pawnBoard >> direction) & ~occupancy;
//     const doublePush =
//       (((STARTING_RANK >> direction) & singlePush) >> direction) & ~occupancy;
//     return singlePush | doublePush;
//   }
// }
// function generatePawnMoves(
//   board: Board,
//   side: PieceColour,
//   moves: Move[],
// ): Move[] {
//   let pawnBoard = board.getBitboard(PieceTypeConstants.Pawn | side);
//
//   const attackTable = isWhite(side) ? WHITE_PAWN_ATTACKS : BLACK_PAWN_ATTACKS;
//   const pawnForwardMoves = generatePawnMoveBoard(
//     pawnBoard,
//     board.occupancy,
//     side,
//   );
//   while (pawnBoard !== 0n) {
//     const square = getLSBIndex(pawnBoard)!;
//     pawnBoard = clearBit64(pawnBoard, square);
//
//     let forwardMoves = pawnForwardMoves & generateFileMask(toFile(square));
//     let attackMoves = attackTable[square]! & board.getEnemyOccupancyFor(side);
//     let targets = forwardMoves | attackMoves;
//
//     while (targets !== 0n) {
//       const to = getLSBIndex(targets)!;
//       targets = clearLSB(targets);
//
//       moves.push(createMove(board, square, to));
//     }
//   }
//   return moves;
// }
// function generateTableMoves(
//   board: Board,
//   piece: Piece,
//   moves: Move[],
//   table: ReadonlyBitboards,
// ): Move[] {
//   let pieceBoard = board.getBitboard(piece);
//   let mask = 0n;
//   while (pieceBoard !== 0n) {
//     const square = getLSBIndex(pieceBoard)!;
//     pieceBoard = clearBit64(pieceBoard, square);
//
//     let targets = table[square]!;
//
//     targets &= ~board.getFriendlyOccupancyFor(getColour(piece));
//     mask |= targets;
//
//     while (targets !== 0n) {
//       const to = getLSBIndex(targets)!;
//       targets = clearLSB(targets);
//
//       moves.push(createMove(board, square, to));
//     }
//   }
//   return moves;
// }
// function generateKnightMoves(
//   board: Board,
//   side: PieceColour,
//   moves: Move[],
// ): Move[] {
//   return generateTableMoves(
//     board,
//     PieceTypeConstants.Knight | side,
//     moves,
//     KNIGHT_ATTACKS,
//   );
// }
// function generateKingMoves(board: Board, side: PieceColour, moves: Move[]) {
//   return generateTableMoves(
//     board,
//     PieceTypeConstants.King | side,
//     moves,
//     KING_ATTACKS,
//   );
// }
//
// function generateRookMoves(
//   board: Board,
//   side: PieceColour,
//   moves: Move[],
// ): Move[] {
//   return generateOrthogonalMoves(board, PieceTypeConstants.Rook | side, moves);
// }
//
// function generateBishopMoves(
//   board: Board,
//   side: PieceColour,
//   moves: Move[],
// ): Move[] {
//   return generateDiagonalMoves(board, PieceTypeConstants.Bishop | side, moves);
// }
// function generateDiagonalMoves(board: Board, piece: Piece, moves: Move[]) {
//   return generateSlidingMoves(board, piece, moves, DIAGONAL_TABLES);
// }
// function generateOrthogonalMoves(
//   board: Board,
//   piece: Piece,
//   moves: Move[],
// ): Move[] {
//   return generateSlidingMoves(board, piece, moves, ORTHOGONAL_TABLES);
// }
// function generateQueenMoves(
//   board: Board,
//   side: PieceColour,
//   moves: Move[],
// ): Move[] {
//   const piece = PieceTypeConstants.Queen | side;
//   return [
//     ...generateOrthogonalMoves(board, piece, moves),
//     ...generateDiagonalMoves(board, piece, moves),
//   ];
// }
// function generateSlidingMoves(
//   board: Board,
//   piece: Piece,
//   moves: Move[],
//   tables: SlidingTables,
// ) {
//   let pieceBoard = board.getBitboard(piece);
//
//   while (pieceBoard !== 0n) {
//     const square = getLSBIndex(pieceBoard)!;
//     pieceBoard = clearBit64(pieceBoard, square);
//
//     const blockerConfig = tables.MASKS[square]! & board.occupancy;
//
//     const index = computeIndex(
//       blockerConfig,
//       tables.MAGICS[square]!,
//       tables.SHIFTS[square]!,
//     );
//
//     let targets = tables.ATTACKS[square]![index]!;
//
//     targets &= ~board.getFriendlyOccupancyFor(getColour(piece));
//
//     while (targets !== 0n) {
//       const to = getLSBIndex(targets)!;
//       targets = clearLSB(targets);
//
//       moves.push(createMove(board, square, to));
//     }
//   }
//   return moves;
// }
//
// export function generatePseudoLegalMoves(
//   board: Board,
//   side: PieceColour = board.activeColour,
// ): Move[] {
//   const moves: Move[] = [];
//   generatePawnMoves(board, side, moves);
//   generateQueenMoves(board, side, moves);
//   generateBishopMoves(board, side, moves);
//   generateRookMoves(board, side, moves);
//   generateKnightMoves(board, side, moves);
//   generateKingMoves(board, side, moves);
//   return moves;
// }
// function filterCaptures(moves: Move[]) {}
