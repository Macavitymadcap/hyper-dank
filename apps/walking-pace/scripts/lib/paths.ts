import path from "node:path";
import { fileURLToPath } from "node:url";

export const appRoot = fileURLToPath(new URL("../..", import.meta.url));
export const root = fileURLToPath(new URL("../../../..", import.meta.url));

export function normalizePath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}
