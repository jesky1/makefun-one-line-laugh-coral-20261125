import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ENTRY, screenEntry } from "./main.ts";

test("entry passes its own screen", () => {
  assert.equal(screenEntry(ENTRY), null);
});

test("entry is 115 characters, one line, no trailing newline", () => {
  assert.equal([...ENTRY].length, 115);
  assert.equal(ENTRY.includes("\n"), false);
  assert.equal(ENTRY, ENTRY.trim());
});

test("two runs write byte-identical entry.txt", () => {
  const outs = [mkdtempSync(join(tmpdir(), "oll-a-")), mkdtempSync(join(tmpdir(), "oll-b-"))];
  for (const dir of outs) {
    execFileSync(process.execPath, ["main.ts"], { cwd: import.meta.dirname, env: { ...process.env, MAKEFUN_OUTPUT_DIR: dir } });
  }
  const a = readFileSync(join(outs[0], "entry.txt"), "utf8");
  const b = readFileSync(join(outs[1], "entry.txt"), "utf8");
  assert.equal(a, ENTRY);
  assert.equal(a, b);
  assert.equal(Buffer.byteLength(a, "utf8"), Buffer.byteLength(ENTRY, "utf8"));
});

test("negative: over-limit line is rejected", () => {
  assert.notEqual(screenEntry("x".repeat(201)), null);
});

test("negative: whitespace-only is rejected", () => {
  assert.notEqual(screenEntry("   "), null);
});

test("negative: multi-line is rejected", () => {
  assert.notEqual(screenEntry("line one\nline two"), null);
});

test("negative: leading/trailing space is rejected", () => {
  assert.notEqual(screenEntry(" " + ENTRY), null);
  assert.notEqual(screenEntry(ENTRY + " "), null);
});

test("negative: control character is rejected", () => {
  assert.notEqual(screenEntry(ENTRY + "\u0007"), null);
});

test("negative: missing terminal punctuation is rejected", () => {
  assert.notEqual(screenEntry(ENTRY.slice(0, -1)), null);
});
