import { Board } from "../board/board.chess.js";
import { pieceToString } from "../piece/piece.format.js";
import { isBitSet64 } from "../utils/bit.utils.js";
import { indexToPiece } from "../utils/bitboard.utils.js";

export class Visualiser {
  private bitboard: bigint = 0n;
  private attackBitboard: bigint = 0n;
  private board: Board;
  private boardElement: HTMLDivElement;
  private bitboardElements: HTMLDivElement;
  constructor(board: Board) {
    this.board = board;
    this.boardElement = document.querySelector(".board") as HTMLDivElement;
    this.bitboardElements = document.querySelector(
      ".bitboards",
    ) as HTMLDivElement;
  }
  private createBoard() {
    let boardHtml = "";
    const occupancyBoard = this.board.occupancy;
    for (let rank = 8; rank > 0; ) {
      rank--;
      for (let file = 0; file < 8; file++) {
        const bit = 8 * rank + file;
        // console.log(bit);
        this.boardElement.appendChild(
          this.createSquare(bit, isBitSet64(occupancyBoard, bit)),
        );
      }
    }
    // for (let bit = 63; bit >= 0; bit -= 1) {
    //   // for (let i = bit - 8; i <= bit; i++) {
    //   //   console.log(i);
    //   //   this.boardElement.appendChild(
    //   //     this.createSquare(i, getNthBit(occupancyBoard, i)),
    //   //   );
    //   // }
    //   this.boardElement.appendChild(
    //     this.createSquare(bit, getNthBit(occupancyBoard, bit)),
    //   );
    // }
    // this.boardElement.innerHTML = boardHtml;
    // squareOverlayElements = document.querySelector("square--overlay");
  }
  private createOverlay(isOn: boolean): HTMLDivElement {
    const overlayElement = document.createElement("div");
    overlayElement.classList.add(
      `square--overlay`,
      `square--overlay--bit-${isOn ? "on" : "off"}`,
    );
    // overlayElement.style.pointerEvents = "none";
    // overlayElement.style.userSelect = "none";
    return overlayElement;
  }
  private createSquare(bitIndex: number, isOn: boolean): HTMLDivElement {
    const cls =
      (Math.floor(bitIndex / 8) + (bitIndex % 8)) % 2 === 0 ? "light" : "dark";
    const squareElement = document.createElement("div");
    squareElement.classList.add(`square`, `square--${cls}`);
    squareElement.dataset.bit = String(bitIndex);
    if (isOn) squareElement.appendChild(this.createPiece(bitIndex));
    squareElement.appendChild(this.createOverlay(isOn));
    squareElement.addEventListener("click", (e) => this.clickSquare(e));
    return squareElement;
  }
  private clickSquare(event: Event) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    const bit = Number(event.target.parentElement!.dataset.bit);
    if (isNaN(bit)) return;

    // for (const [i, j] of this.board.bitboards.getBitBoards().entries()) {
    //   if (getNthBit(j, bit)) {
    //     const name = this.board.bitboards.indexToPiece(i);
    //     const colour = Piece.getPieceColour(name);
    //     const isWhite = colour === Piece.White ? true : false;
    //
    //     const enemyColour = colour === Piece.White ? Piece.Black : Piece.White;
    //     const friendly = clearNthBit(
    //       this.board.bitboards.getFriendlyOccupancyFor(colour),
    //       bit,
    //     );
    //     if (Piece.isType(name, Piece.Pawn)) {
    //       // this.attackBitboard ^=
    //       //   ~generatePawnMoves(
    //       //     1n << BigInt(bit),
    //       //     this.bitboard,
    //       //     this.board.bitboards.getColourOccupancy(enemyColour),
    //       //     isWhite,
    //       //   ) ^ BOARD_MASK;
    //     } else if (Piece.isType(name, Piece.Knight)) {
    //       this.attackBitboard ^= ~KNIGHT_ATTACKS[bit]! ^ BOARD_MASK;
    //       // ~generatePawnMoves(
    //       //   1n << BigInt(bit),
    //       //   this.bitboard,
    //       //   this.board.bitboards.getColourOccupancy(enemyColour),
    //       //   isWhite,
    //       // ) ^ BOARD_MASK;
    //     } else if (Piece.isType(name, Piece.King)) {
    //       this.attackBitboard ^= ~KING_ATTACKS[bit]! ^ BOARD_MASK ^ friendly;
    //       // this.board.bitboards.getFriendlyOccupancyFor(colour);
    //     } else if (Piece.isType(name, Piece.Rook)) {
    //       this.attackBitboard ^= ~ROOK_ATTACKS[bit]! ^ BOARD_MASK;
    //     }
    //   }
    //   this.renderOverlay(this.attackBitboard);
    // }
  }
  private name(bit: number) {}
  private createPiece(bitIndex: number): HTMLDivElement {
    const div = document.createElement("div");
    for (const [i, j] of this.board.bitboardsList.entries()) {
      if (isBitSet64(j, bitIndex)) {
        const piece = pieceToString(indexToPiece(i)).split(" ");
        const colour = piece[0]?.slice(0, 1).toLowerCase();
        const type = piece[1]?.toLowerCase();
        div.classList.add("piece");
        div.style.backgroundImage = `url(./assets/${type}-${colour}.svg)`;
        break;
      }
    }
    return div;
  }
  renderOverlay(bitboard?: bigint) {
    if (!bitboard) {
      bitboard = this.bitboard;
    }

    for (let bit = 63; bit >= 0; bit--) {
      const isOn = isBitSet64(bitboard, bit);
      const overlay = document.querySelector(
        `[data-bit="${bit}"] > .square--overlay`,
      ) as HTMLDivElement;
      overlay.classList.toggle("square--overlay--bit-on", isOn);
    }
  }
  createBitboardElement(bitboardStr: string) {
    const bitboardElement = document.createElement("div");
    bitboardElement.classList.add("bitboard");

    for (const char of bitboardStr) {
      const cls = char === "0" ? "off" : "on";

      bitboardElement.innerHTML += `<span class="bit bit--${cls}">${char}</span>`;
    }
    return bitboardElement;
  }
  toggleBitBoard(event: Event) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    this.bitboard ^= BigInt(event.target.dataset.bitboard!);
    const isActive = event.target.classList.contains("button--active");
    event.target.classList.toggle("button--active", !isActive);
    this.renderOverlay();
  }
  createButton(title: string, bitboardStr: string) {
    const button = document.createElement("button");
    button.innerText = title;
    button.dataset.bitboard = bitboardStr;
    button.classList.add("bitboard--button");
    button.classList.add("button--active");
    button.addEventListener("click", (e) => this.toggleBitBoard(e));
    return button;
  }
  createBitboardContainer() {
    const bitboardContainer = document.createElement("div");
    bitboardContainer.classList.add("bitboard--container");
    return bitboardContainer;
  }
  createBitboardElements() {
    for (const [i, j] of this.board.bitboardsList.entries()) {
      const name = pieceToString(indexToPiece(i));
      const bitboardStr = j.toString(2).padStart(64, "0");
      const bitboardContainer = this.createBitboardContainer();
      this.bitboard |= j;
      bitboardContainer.appendChild(this.createButton(name, String(j)));
      bitboardContainer.appendChild(this.createBitboardElement(bitboardStr));
      this.bitboardElements.appendChild(bitboardContainer);
    }
  }
  inputMask(mask: number) {
    this.bitboard ^= BigInt(mask);
    this.renderOverlay();
  }
  generatePawnMoves() {}
}
