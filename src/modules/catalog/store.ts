// Persisted broadcast history (BroadcastRun log).
import { loadCollection, saveCollection } from "@/lib/persist";
import type { BroadcastRun } from "./types";

const g = globalThis as unknown as { __uksc_broadcasts?: BroadcastRun[] };
const runs: BroadcastRun[] = (g.__uksc_broadcasts ??= loadCollection<BroadcastRun>("broadcasts") ?? []);

export function listRuns(): BroadcastRun[] {
  return [...runs].sort((a, b) => b.at.localeCompare(a.at));
}

export function addRun(run: BroadcastRun): void {
  runs.push(run);
  saveCollection("broadcasts", runs);
}
