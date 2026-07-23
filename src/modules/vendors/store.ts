// Vendor registry (M2). Seeded from the 27 codes and persisted to disk so status,
// linked Location, and reliability survive restarts. Swap for Prisma later.
import { VENDORS } from "@/config/catalog";
import { loadCollection, saveCollection } from "@/lib/persist";

export interface Vendor {
  code: string;
  status: "active" | "pending";
  shopifyLocationId: string | null;
  reliabilityScore: number; // 0..1
  submissions: number;
  lastSeenAt: string | null;
}

interface Shape {
  vendors: Map<string, Vendor>;
}

const g = globalThis as unknown as { __uksc_vendors?: Shape };
const store: Shape = (g.__uksc_vendors ??= { vendors: load() });

function load(): Map<string, Vendor> {
  const saved = loadCollection<Vendor>("vendors");
  const list =
    saved ??
    VENDORS.map((code) => ({
      code,
      status: "active" as const,
      shopifyLocationId: null,
      reliabilityScore: 1,
      submissions: 0,
      lastSeenAt: null,
    }));
  const map = new Map(list.map((v) => [v.code, v]));
  if (!saved) persist(map);
  return map;
}

function persist(map: Map<string, Vendor>): void {
  saveCollection("vendors", [...map.values()]);
}

export function listVendors(): Vendor[] {
  return [...store.vendors.values()].sort((a, b) => a.code.localeCompare(b.code));
}

export function getVendor(code: string): Vendor | undefined {
  return store.vendors.get(code);
}

export function updateVendor(code: string, patch: Partial<Vendor>): Vendor | undefined {
  const v = store.vendors.get(code);
  if (!v) return undefined;
  const next = { ...v, ...patch };
  store.vendors.set(code, next);
  persist(store.vendors);
  return next;
}

/** Record activity when a submission from this vendor is ingested. */
export function touchVendor(code: string): void {
  const v = store.vendors.get(code);
  if (!v) return;
  store.vendors.set(code, {
    ...v,
    submissions: v.submissions + 1,
    lastSeenAt: new Date().toISOString(),
  });
  persist(store.vendors);
}
