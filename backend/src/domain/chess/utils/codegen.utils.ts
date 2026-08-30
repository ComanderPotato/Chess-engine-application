import {
  hasDiagonalMovement,
  hasOrthogonalMovement,
} from "../piece/piece.chess.js";
import { Piece } from "../piece/piece.types.js";

export function formatGeneratedConstant(
  variableName: string,
  values: number[] | bigint[],
): string {
  return `export const ${variableName} = [
    ${values.map((value) => formatValue(value)).join(",\n")}
  ] as const;`;
}
function formatValue(value: number | bigint): string {
  return typeof value === "number" ? value.toString() : formatMagic(value);
}
function formatMagic(value: bigint): string {
  return `0x${value.toString(16)}n`;
}
