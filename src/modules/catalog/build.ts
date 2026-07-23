// Build the current drop from products that have been approved (published).
import { listDrafts } from "@/modules/onboarding/store";
import type { Catalog, CatalogItem } from "./types";

export function buildCatalog(): Catalog {
  const items: CatalogItem[] = listDrafts()
    .filter((d) => d.status === "published")
    .map((d) => ({
      id: d.id,
      title: d.suggestedTitle,
      price: d.sellPrice,
      collection: d.collection,
      vendor: d.vendor,
      photoName: d.photos[0]?.name,
      shopifyProductId: d.shopifyProductId,
    }));
  return { builtAt: new Date().toISOString(), items };
}

/** Plain-text catalog for message channels (Telegram/WhatsApp). */
export function renderCatalogText(catalog: Catalog): string {
  if (!catalog.items.length) return "No new arrivals today.";
  const lines = catalog.items.map(
    (i) => `• ${i.title} — £${i.price?.toFixed(2) ?? "?"}`,
  );
  return [`🧢 UKSC — today's drop (${catalog.items.length})`, "", ...lines, "", "Shop now: www.ukstylishclub.com"].join("\n");
}
