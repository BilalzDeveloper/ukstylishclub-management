// Draft store. In-memory for the M1 dev slice (survives across requests within the
// running server, resets on restart) and seeded so the review queue is populated.
// Swap this module for a Prisma-backed repository once `prisma generate` can run
// (blocked in the build sandbox — see src/lib/db.ts).
import { loadCollection, saveCollection } from "@/lib/persist";
import type { ProductDraft, DraftStatus } from "./types";

interface StoreShape {
  drafts: Map<string, ProductDraft>;
}

const g = globalThis as unknown as { __uksc_onboarding?: StoreShape };
const store: StoreShape = (g.__uksc_onboarding ??= { drafts: load() });

function load(): Map<string, ProductDraft> {
  const saved = loadCollection<ProductDraft>("drafts");
  const list = saved ?? seed();
  const map = new Map(list.map((d) => [d.id, d]));
  if (!saved) saveCollection("drafts", list);
  return map;
}

function persist(): void {
  saveCollection("drafts", [...store.drafts.values()]);
}

export function listDrafts(): ProductDraft[] {
  return [...store.drafts.values()].sort((a, b) =>
    b.receivedAt.localeCompare(a.receivedAt),
  );
}

export function getDraft(id: string): ProductDraft | undefined {
  return store.drafts.get(id);
}

export function upsertDraft(draft: ProductDraft): void {
  store.drafts.set(draft.id, draft);
  persist();
}

export function setStatus(
  id: string,
  status: DraftStatus,
  patch: Partial<ProductDraft> = {},
): ProductDraft | undefined {
  const d = store.drafts.get(id);
  if (!d) return undefined;
  const next = { ...d, ...patch, status };
  store.drafts.set(id, next);
  persist();
  return next;
}

function seed(): ProductDraft[] {
  const now = Date.now();
  const iso = (mins: number) => new Date(now - mins * 60_000).toISOString();
  const samples: ProductDraft[] = [
    {
      id: "seed-1", status: "draft", receivedAt: iso(12), source: "telegram",
      vendor: "Rag", costPrice: 22, sellPrice: 34.99,
      sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], colours: ["Black", "White"],
      productType: "Trainers", suggestedTitle: "Rag Trainers", collection: "Trainers & Footwear",
      photos: [{ name: "photo1.jpg" }, { name: "photo2.jpg" }],
      captionRaw: "Rag / £22 / UK 7-11 / Qty 6 / black-white",
      confidence: 0.55, flags: [],
    },
    {
      id: "seed-2", status: "draft", receivedAt: iso(40), source: "telegram",
      vendor: null, costPrice: 18, sellPrice: 27.99,
      sizes: ["S", "M", "L", "XL", "XXL"], colours: ["Grey"],
      productType: "Hoodie", suggestedTitle: "Hoodie", collection: "Tracksuits For Men",
      photos: [{ name: "img_2231.jpg" }],
      captionRaw: "grey hoodie 18 s-xxl",
      confidence: 0.28, flags: ["unknown vendor", "low confidence"],
    },
    {
      id: "seed-3", status: "published", receivedAt: iso(190), source: "telegram",
      vendor: "Siim", costPrice: 9, sellPrice: 16.99,
      sizes: ["S", "M", "L", "XL"], colours: ["Navy"],
      productType: "T-shirt", suggestedTitle: "Siim T-shirt", collection: "T-Shirts For Men",
      photos: [{ name: "tee.jpg" }],
      captionRaw: "Siim tee £9 navy S-XL qty12",
      confidence: 0.6, flags: [], shopifyProductId: "gid://shopify/Product/1234567890",
    },
  ];
  return samples;
}
