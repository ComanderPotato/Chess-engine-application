import { Board } from "../dist/domain/chess/board/board.chess.js";
import { Piece } from "../dist/domain/chess/board/piece.chess.js";
import { Visualiser } from "../dist/domain/chess/debug/visualiser.chess.js";

const board = new Board();
const visualiser = new Visualiser(board);

// const bitboardsElement = document.querySelector(".bitboards");
// const boardElement = document.querySelector(".board");
// let squareOverlayElements;
//
// let bitboard = 0n;
// const bitboards = board.bitBoards.bitBoards;
//
// function getNthBit(bitboard, n) {
//   return ((bitboard >> BigInt(n)) & 1n) == 1n;
// }
// function createBoard() {
//   let boardHtml = "";
//   for (let bit = 63; bit >= 0; bit--) {
//     boardHtml += createSquare(bit, getNthBit(bitboard, bit));
//   }
//   boardElement.innerHTML = boardHtml;
//   squareOverlayElements = document.querySelector("square--overlay");
// }
//
// function createSquare(bit, isOn) {
//   const cls = (Math.floor(bit / 8) + (bit % 8)) % 2 === 0 ? "light" : "dark";
//   return `
//     <div class="square square--${cls}" data-bit="${bit}">
//       ${bit}
//       <div class="square--overlay square--overlay--bit-${isOn ? "on" : "off"}"></div>
//     </div>
//   `;
// }
// function createOverlay(isOn) {
//   return `<div class="square--overlay square--overlay--bit-${isOn ? "on" : "off"}"></div>`;
// }
// function renderOverlay() {
//   for (let bit = 63; bit >= 0; bit--) {
//     const isOn = getNthBit(bitboard, bit);
//     const overlay = document.querySelector(
//       `[data-bit="${bit}"] > .square--overlay`,
//     );
//     overlay.classList.toggle("square--overlay--bit-on", isOn);
//   }
// }
//
// function createBitboardElement(bitboard) {
//   const bitboardElement = document.createElement("div");
//   bitboardElement.classList.add("bitboard");
//
//   for (const char of bitboard) {
//     const cls = char === "0" ? "off" : "on";
//
//     bitboardElement.innerHTML += `<span class="bit bit--${cls}">${char}</span>`;
//   }
//   return bitboardElement;
// }
// function toggleBitBoard(event) {
//   bitboard ^= BigInt(event.target.dataset.bitboard);
//   const isActive = event.target.classList.contains("button--active");
//   event.target.classList.toggle("button--active", !isActive);
//   renderOverlay();
// }
// function createButton(title, bitboard) {
//   const button = document.createElement("button");
//   button.innerText = title;
//   button.dataset.bitboard = bitboard;
//   button.classList.add("bitboard--button");
//   button.classList.add("button--active");
//   button.addEventListener("click", (e) => toggleBitBoard(e));
//   return button;
// }
// function createBitboardContainer() {
//   const bitboardContainer = document.createElement("div");
//   bitboardContainer.classList.add("bitboard--container");
//   return bitboardContainer;
// }
// function createBitboardElements() {
//   for (const [i, j] of board.bitBoards.bitBoards.entries()) {
//     const name = Piece.convertToString(board.bitBoards.indexToPiece(i));
//     const bitboardStr = j.toString(2).padStart(64, "0");
//     const bitboardContainer = createBitboardContainer();
//     bitboard |= j;
//     bitboardContainer.appendChild(createButton(name, j));
//     bitboardContainer.appendChild(createBitboardElement(bitboardStr));
//     bitboardsElement.appendChild(bitboardContainer);
//   }
// }
//
visualiser.createBitboardElements();
visualiser.createBoard();
