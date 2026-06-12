import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "..", "local", "system-prompt-local.txt");
const dst = join(root, "lib", "system-prompt-local.txt");

mkdirSync(dirname(dst), { recursive: true });

if (existsSync(src)) {
  copyFileSync(src, dst);
  console.log("OK: system-prompt-local.txt → lib/ (from local/)");
} else if (existsSync(dst)) {
  console.log("OK: lib/system-prompt-local.txt（同梱版を使用）");
} else {
  console.error("ERROR: system-prompt-local.txt がありません");
  process.exit(1);
}
