// Interim JSON-file persistence for the dev/self-hosted phase, so drafts and
// vendors survive server restarts. Behind the same shape a Prisma repository would
// expose, so swapping it out later (once `prisma generate` can run — blocked in the
// build sandbox, see src/lib/db.ts) is a localised change.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DIR = join(process.cwd(), ".data");

export function loadCollection<T>(name: string): T[] | null {
  try {
    const file = join(DIR, `${name}.json`);
    if (!existsSync(file)) return null;
    return JSON.parse(readFileSync(file, "utf8")) as T[];
  } catch {
    return null;
  }
}

export function saveCollection<T>(name: string, items: T[]): void {
  try {
    if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
    writeFileSync(join(DIR, `${name}.json`), JSON.stringify(items, null, 2));
  } catch {
    // best-effort: a read-only FS just means no cross-restart persistence in dev
  }
}
