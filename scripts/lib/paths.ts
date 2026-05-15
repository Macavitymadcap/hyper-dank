import path from "node:path";

export const root = process.cwd();

export function normalizePath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}
