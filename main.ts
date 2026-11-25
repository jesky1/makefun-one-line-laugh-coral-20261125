// makefun-one-line-laugh-coral-20261125 — "One Line, One Laugh"
// One funny line — a joke, a quip, a punchy observation — written to
// /output/entry.txt. The program is deliberately deterministic: the same
// single line every run, so the judge always sees exactly the line below
// and nothing else.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const ENTRY =
  "My bank account and my phone battery share the same coping strategy: die quietly at 1% and pretend it was my fault.";

// Gate the kit seals: UTF-8 text, 1..200 characters, not only whitespace,
// exactly one line, no trailing whitespace, no control or invisible chars.
export function screenEntry(text: string): string | null {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) return "length must be 1..200 characters";
  if (text.trim().length === 0) return "entry must not be only whitespace";
  if (text !== text.trim()) return "no leading or trailing whitespace";
  if (/[\r\n]/.test(text)) return "entry must be a single line";
  if (/[\u0000-\u001F\u007F]/.test(text)) return "no control characters";
  if (/[\u200B-\u200F\uFEFF]/.test(text)) return "no invisible characters";
  if (!/[A-Za-z]/.test(text)) return "entry must contain letters";
  if (/https?:\/\/|www\./i.test(text)) return "no links in the entry";
  if (/(.)\1{4,}/.test(text)) return "no repeated-character spam";
  if (text.split(/\s+/).length < 5) return "entry must be at least 5 words";
  if (!/[.!?]$/.test(text)) return "entry must end with terminal punctuation";
  return null;
}

function main(): void {
  const problem = screenEntry(ENTRY);
  if (problem) {
    console.error(`entry rejected: ${problem}`);
    process.exit(1);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
  console.log(`wrote ${[...ENTRY].length}-character entry to ${join(outDir, "entry.txt")}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
