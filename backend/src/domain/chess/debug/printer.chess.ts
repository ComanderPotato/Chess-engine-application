import { isBitSet64, toBinary } from "../utils/bit.utils.js";
import { Bitboard, Square } from "../board/types.chess.js";
import {
  BOARD_DIMENSION,
  BOARD_SIZE,
  FILES,
  RANKS,
} from "../board/board.constants.js";
import { fileRankToSquare, toRank } from "../utils/square.utils.js";
import { Board } from "../board/board.chess.js";
import { pieceToString } from "../piece/piece.format.js";
import { pieceToNotation } from "../piece/piece.notation.js";

type lineType = "rank" | "fileLabel" | "divider";

const FILE_LINE = printLine("fileLabel");
const DIVIDER_LINE = printLine("divider");

interface IPrintOptions {
  cellWidth?: number;
  title?: string;
  fenString?: string;
}
export function printAttackBitboard(
  pieceBitboard: Bitboard,
  attackBitboard: Bitboard,
  options: IPrintOptions = {},
): void {
  const { cellWidth = 3, title = "", fenString = "" } = options;
  console.log(`${title}\n`);
  printDivider(cellWidth);

  for (let rank = RANKS.EIGHTH; rank >= RANKS.FIRST; rank--) {
    let content = "";
    for (let file = FILES.A; file <= FILES.H; file++) {
      const square = fileRankToSquare(file, rank);
      if (isBitSet64(pieceBitboard, square)) {
        content += "1";
      } else if (isBitSet64(attackBitboard, square)) {
        content += "X";
      } else {
        content += "0";
      }
    }
    printRank(content.split(""), rank + 1, cellWidth);
    printDivider(cellWidth);
  }
  printFileLabel(cellWidth);
}
export function printBitboard(bitboard: Bitboard, options: IPrintOptions = {}) {
  const { cellWidth = 3, title = "", fenString = "" } = options;

  const rowMask: bigint = 0xffn;
  console.log(`${title}\n`);
  printDivider(cellWidth);
  for (let rowIdx = 7n; rowIdx >= 0n; rowIdx--) {
    const shift = 8n * rowIdx;
    const row = (bitboard & (rowMask << shift)) >> shift;
    printRank(
      row.toString(2).padStart(8, "0").split("").reverse(),
      Number(rowIdx + 1n),
      cellWidth,
    );
    printDivider(cellWidth);
  }
  printFileLabel(cellWidth);
  console.log(fenString);
}
export function printChessBoard(board: Board, options: IPrintOptions = {}) {
  const { cellWidth = 3, title = "", fenString = "" } = options;
  console.log(`${title}\n`);
  printDivider(cellWidth);
  for (let row = BOARD_SIZE; row > 0; row -= BOARD_DIMENSION) {
    let content = [];
    for (let square = row - BOARD_DIMENSION; square < row; square++) {
      content.push(pieceToNotation(board.pieceAt(square as Square)));
    }
    printRank(content, Number(toRank(row as Square)), cellWidth);
    printDivider(cellWidth);
  }
  printFileLabel(cellWidth);
  console.log(fenString);
}
function printRank(content: any[], index: number, cellWidth = 3) {
  console.log(printLine("rank", cellWidth, content, String(index)));
}
function printFileLabel(cellWidth: number = 3) {
  console.log(printLine("fileLabel", cellWidth));
}
function printDivider(cellWidth: number = 3) {
  console.log(printLine("divider", cellWidth));
}
export function printLine(
  lineType: lineType,
  cellWidth: number = 3,
  content?: any[],
  rowNumber: string = "",
) {
  let space = "|";
  let pad = " ";
  if (lineType == "fileLabel") {
    content = Array(8)
      .fill(0)
      .map((_, i) => String.fromCharCode("a".charCodeAt(0) + i));
    space = " ";
  } else if (lineType == "divider") {
    content = Array(8).fill("");
    space = "+";
    pad = "-";
  }
  if (!content) throw new Error("No content");
  return space
    .concat(
      content
        .map((char) => {
          // const conversion = Piece.convertToSymbol(char);
          // char = conversion ?? String(char);
          return createCell(char, pad, cellWidth);
        })
        .join(space),
    )
    .concat(space)
    .concat(rowNumber.padStart(2));
}

function createCell(content: any, pad: string, cellWidth: number = 3): string {
  if (typeof content === "bigint") content = String(content);
  const l = content.length;
  const space = cellWidth - l;
  const lPad = Math.floor(space / 2);
  const rPad = Math.ceil(space / 2);
  return pad.repeat(lPad) + content + pad.repeat(rPad);
}
// export class Printer {
//   private board: Board;
//   private cellWidth: number;
//   private fileLine: string;
//   private dividerLine: string;
//
//   constructor(board: Board = new Board(), cellWidth: number = 3) {
//     this.board = board;
//     this.cellWidth = cellWidth;
//     this.fileLine = this.printLine("fileLabel");
//     this.dividerLine = this.printLine("divider");
//   }
//   public printLine(
//     lineType: lineType,
//     content?: any[],
//     rowNumber: string = "",
//   ) {
//     let space = "|";
//     let pad = " ";
//     if (lineType == "fileLabel") {
//       content = Array(8)
//         .fill(0)
//         .map((_, i) => String.fromCharCode("a".charCodeAt(0) + i));
//       space = " ";
//     } else if (lineType == "divider") {
//       content = Array(8).fill("");
//       space = "+";
//       pad = "-";
//     }
//     if (!content) throw new Error("No content");
//     return space
//       .concat(
//         content
//           .map((char) => {
//             // const conversion = Piece.convertToSymbol(char);
//             // char = conversion ?? String(char);
//             return this.createCell(char, pad);
//           })
//           .join(space),
//       )
//       .concat(space)
//       .concat(rowNumber.padStart(2));
//   }
//   public createCell(content: any, pad: string) {
//     if (typeof content === "bigint") content = String(content);
//     const l = content.length;
//     const space = this.cellWidth - l;
//     const lPad = Math.floor(space / 2);
//     const rPad = Math.ceil(space / 2);
//     return pad.repeat(lPad) + content + pad.repeat(rPad);
//   }
//
//   private printFileLabel() {
//     console.log(this.fileLine);
//   }
//   private printDivider() {
//     console.log(this.dividerLine);
//   }
//   private printRank(content: any[], index: number) {
//     // const content = this.state.slice(index - 8, index);
//
//     const rowNumber = String(toRank(index - 1));
//     console.log(this.printLine("rank", content, rowNumber));
//   }
//   public static printSimple(bb: Bitboard) {
//     const rowMask = 0xffn;
//     let boardText = "";
//     for (let rowIdx = 7n; rowIdx >= 0n; rowIdx--) {
//       const row = (bb & (rowMask << (8n * rowIdx))) >> (8n * rowIdx);
//       boardText +=
//         row.toString(2).padStart(8, "0").split("").reverse().join("|") +
//         " " +
//         Number(rowIdx + 1n) +
//         " \n";
//       boardText += "-".repeat(8).split("").join("+") + "\n";
//     }
//
//     boardText += "abcdefgh".split("").join("|");
//     console.log(boardText);
//     console.log(" ");
//
//     // let content = 1n;
//     // let i = BOARD_SIZE - 1;
//     // let rowSize = 1n << 8n;
//     //
//     // let row = 8;
//     // for (; i >= 0; i--) {
//     //   const bit = (bitBoard >> BigInt(i)) & 1n;
//     //   content = (content << 1n) | bit;
//     //   if ((content >> BigInt(8)) & 1n) {
//     //     content = content & (rowSize - 1n);
//     //
//     //     console.log(
//     //       content.toString(2).padStart(8, "0").split("").join(" ") +
//     //         " " +
//     //         row--,
//     //     );
//     //     content = 1n;
//     //   }
//     // }
//     // console.log("abcdefgh".split("").join(" "));
//   }
//   public printBitBoard(pieceTypes?: PieceType[], colourTypes?: PieceColour[]) {
//     let content = 1n;
//     let i = BOARD_SIZE - 1;
//     let rowSize = 1n << 8n;
//
//     let board = 0n;
//     if (!pieceTypes || !colourTypes) {
//       board = this.board.bitboards.getAllOccupancy();
//     } else {
//       pieceTypes.forEach(
//         (type) => (board |= this.board.bitboards.getTypeOccupancy(type)),
//       );
//       colourTypes.forEach(
//         (type) => (board |= this.board.bitboards.getColourOccupancy(type)),
//       );
//     }
//     for (; i >= 0; i--) {
//       const bit = (board >> BigInt(i)) & 1n;
//
//       content = (content << 1n) | bit;
//       if ((content >> BigInt(8)) & 1n) {
//         content = content & (rowSize - 1n);
//         const val = toBinary(content)
//           .split("")
//           .map((v) => BigInt(v));
//         this.printRank(val, 64 - i);
//         this.printDivider();
//         content = 1n;
//       }
//     }
//     this.printFileLabel();
//   }
//   // public printBoard(pieceTypes?: number[], colourTypes?: number[]) {
//   //   let i = BOARD_SIZE - 1;
//   //
//   //   const board: string[] = [];
//   //   const bitBoards = this.board.getBitBoards();
//   //
//   //   let toPick: boolean[] = Array(12).fill(false);
//   //   if (!pieceTypes || !colourTypes) {
//   //     toPick.fill(true);
//   //     pieceTypes = [0, 1, 2, 3, 4, 5];
//   //     colourTypes = [PieceColour.White, PieceColour.Black];
//   //   }
//   //   // else if (!pieceTypes) {
//   //   //   pieceTypes = [0, 1, 2, 3, 4, 5];
//   //   // } else if (!colourTypes) {
//   //   //   colourTypes = [Piece.White, Piece.Black];
//   //   // }
//   //   pieceTypes.forEach((pieceType) => {
//   //     colourTypes.forEach((colourType) => {
//   //       toPick[pieceToIndex(pieceType | colourType)] = true;
//   //     });
//   //   });
//   //
//   //   for (; i >= 0; i--) {
//   //     let found = false;
//   //     for (let j = 0; j < bitBoards.length; j++) {
//   //       if (!toPick[j]) continue;
//   //       const bitBoard = bitBoards[j]!;
//   //       if (((bitBoard >> BigInt(i)) & 1n) === 1n) {
//   //         const symbol = pieceToSymbol(Number(indexToPiece(j)));
//   //         board.push(symbol);
//   //         found = true;
//   //         break;
//   //       }
//   //     }
//   //     if (!found) board.push("0");
//   //     if (i % 8 === 0) {
//   //       this.printRank(
//   //         board.slice(board.length - 8, board.length),
//   //         BOARD_SIZE - i,
//   //       );
//   //       this.printDivider();
//   //     }
//   //   }
//   //   this.printFileLabel();
//   // }
//
//   // public printBoard() {
//   //   let i = 0;
//   //   this.printDivider();
//   //   for (; i < this.state.length; i++) {
//   //     if ((i * 8) % BOARD_SIZE == 0 && i != 0) {
//   //       this.printRank(i);
//   //       this.printDivider();
//   //     }
//   //   }
//   //   this.printRank(i);
//   //   this.printDivider();
//   //   this.printFileLabel();
//   // }
// }
