import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

let cached: string | null = null;

export function getSystemPrompt(): string {
  if (cached) return cached;
  const path = join(process.cwd(), "lib", "system-prompt-local.txt");
  if (!existsSync(path)) {
    throw new Error("system-prompt-local.txt がありません。npm run sync-prompt を実行してください。");
  }
  cached = readFileSync(path, "utf-8");
  return cached;
}
