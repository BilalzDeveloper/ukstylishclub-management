// Onboarding pipeline: a Telegram submission → a reviewable ProductDraft, and an
// approved draft → a live Shopify product. Spec: docs/flows/vendor-onboarding.md.
import { randomUUID } from "crypto";
import { parseCaption } from "@/lib/telegram/caption";
import { classify } from "@/lib/ai/extract";
import { publishDraftToShopify } from "@/lib/shopify/products";
import { shopifyConfigured } from "@/lib/shopify/client";
import { collectionForType } from "@/config/catalog";
import { upsertDraft, getDraft, setStatus } from "./store";
import type { ProductDraft, Submission } from "./types";

// Vendor cost → proposed sell price. Placeholder margin until the M2 MarginRule
// engine (docs/business-model.md) lands; always shown to the manager for review.
const MARGIN = 1.55;
export function proposeSellPrice(cost: number | null): number | null {
  if (cost == null) return null;
  return Math.floor(cost * MARGIN) + 0.99;
}

export async function ingestSubmission(sub: Submission): Promise<ProductDraft> {
  const caption = parseCaption(sub.caption);
  const cls = await classify(sub, caption.vendor);

  const collection = collectionForType(cls.productType);
  const flags: string[] = [];
  if (caption.costPrice == null) flags.push("missing price");
  if (!caption.vendor) flags.push("unknown vendor");
  if (cls.confidence < 0.35) flags.push("low confidence");
  if (caption.sizes.length === 0) flags.push("no sizes");
  if (!collection) flags.push("no collection match");

  const draft: ProductDraft = {
    id: randomUUID(),
    status: "draft",
    receivedAt: sub.receivedAt,
    source: "telegram",
    vendor: caption.vendor,
    costPrice: caption.costPrice,
    sellPrice: proposeSellPrice(caption.costPrice),
    sizes: caption.sizes,
    colours: cls.colours,
    productType: cls.productType,
    suggestedTitle: cls.suggestedTitle,
    collection,
    photos: sub.photos,
    captionRaw: sub.caption,
    confidence: cls.confidence,
    flags,
  };
  upsertDraft(draft);
  return draft;
}

export interface PublishOutcome {
  ok: boolean;
  message: string;
  draft?: ProductDraft;
}

/** Approve a draft → publish to Shopify (if configured) and mark it published. */
export async function publishDraft(id: string): Promise<PublishOutcome> {
  const draft = getDraft(id);
  if (!draft) return { ok: false, message: "draft not found" };
  if (draft.status === "published") return { ok: true, message: "already published", draft };

  if (!shopifyConfigured()) {
    // Dev/offline: record approval without a live write.
    const next = setStatus(id, "published", {
      shopifyProductId: "dev:not-published (no Shopify token)",
    });
    return { ok: true, message: "approved (dev — Shopify token not set, no live product created)", draft: next };
  }

  try {
    const res = await publishDraftToShopify(draft);
    const next = setStatus(id, "published", { shopifyProductId: res.productId });
    return { ok: true, message: `published ${res.productId}`, draft: next };
  } catch (e) {
    return { ok: false, message: `Shopify publish failed: ${(e as Error).message}` };
  }
}

export function rejectDraft(id: string): PublishOutcome {
  const next = setStatus(id, "rejected");
  return next
    ? { ok: true, message: "rejected", draft: next }
    : { ok: false, message: "draft not found" };
}
