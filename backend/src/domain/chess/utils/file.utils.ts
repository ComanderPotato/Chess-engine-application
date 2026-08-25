import fs from "fs";
export function saveGenerated(
  filePath: string,
  variableName: string,
  values: (number | bigint)[],
) {
  const content = `
export const ${variableName} = [
${values.map((v) => `  0x${v.toString(16)}n,`).join("\n")}
] as const;
`;

  fs.writeFileSync(filePath, content);
}
export function appendGenerated(
  filePath: string,
  variableName: string,
  values: (number | bigint)[],
) {
  const content = `
export const ${variableName} = [
${values.map((v) => formatValue(v)).join("\n")}
] as const;
`;

  fs.appendFileSync(filePath, content);
}
function formatValue(value: number | bigint): string {
  if (typeof value === "number") {
    return `${value.toString()},`;
  } else {
    return `  0x${value.toString(16)}n,`;
  }
}
export function removeFile(filePath: string): void {
  fs.rmSync(filePath);
}
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function clearFile(filePath: string) {
  fs.rmSync(filePath);
}
