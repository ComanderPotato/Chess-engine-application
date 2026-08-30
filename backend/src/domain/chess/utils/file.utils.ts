import fs from "fs";

export function appendToFile(filePath: string, content: string): void {
  fs.appendFileSync(filePath, content);
}
export function writeToFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content);
}
export function deleteFile(filePath: string): void {
  fs.rmSync(filePath);
}
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
