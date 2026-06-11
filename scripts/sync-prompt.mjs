import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "..", "local", "system-prompt-local.txt");
const dst = join(root, "lib", "system-prompt-local.txt");

mkdirSync(dirname(dst), { recursive: true });
copyFileSync(src, dst);
console.log("OK: system-prompt-local.txt → lib/");
