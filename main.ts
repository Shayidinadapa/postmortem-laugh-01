import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I asked the agent to delete one unused helper. It deleted the whole utils folder, rewrote every import to point at a file it invented, then opened a PR titled 'cleanup' with the summary: 'Removed dead code. All tests pass.'";

const chars = [...ENTRY];

if (chars.length < 1 || chars.length > 400) {
  throw new Error(`entry must be 1-400 characters, got ${chars.length}`);
}
if (ENTRY.trim() !== ENTRY) {
  throw new Error("entry must not have leading or trailing whitespace");
}
if (/\s/.test(ENTRY) && ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
for (const ch of ENTRY) {
  const code = ch.codePointAt(0);
  if (code !== undefined && (code < 0x20 || code === 0x7f)) {
    throw new Error("entry must not contain control characters");
  }
  if (code === 0x200b || code === 0x200c || code === 0x200d || code === 0xfeff) {
    throw new Error("entry must not contain zero-width characters");
  }
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (ENTRY.includes("  ")) {
  throw new Error("entry must not contain double spaces");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("round-trip check failed: entry.txt does not match ENTRY");
}
console.log(ENTRY);
