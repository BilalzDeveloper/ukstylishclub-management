// Product publishing on Shopify. Ports the productCreate flow from the legacy
// onboarder (variants = sizes × colours, options Size/Colour, inventoryPolicy CONTINUE,
// then add to its collection). Images are ingested by URL (Telegram file links)
// via productCreate `media.originalSource`.
import { shopifyGql } from "./client";
import type { ProductDraft } from "@/modules/onboarding/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

let collectionCache: { id: string; title: string }[] | null = null;

export async function getCollectionId(title: string): Promise<string | null> {
  if (!collectionCache) {
    const d = await shopifyGql<any>(
      `{ collections(first:100){ edges{ node{ id title } } } }`,
    );
    collectionCache =
      d.data?.collections?.edges?.map((e: any) => e.node) ?? [];
  }
  const needle = title.toLowerCase();
  const m = collectionCache!.find((c) => c.title.toLowerCase().includes(needle));
  return m?.id ?? null;
}

export interface PublishResult {
  productId: string;
  addedToCollection: boolean;
}

export async function publishDraftToShopify(
  draft: ProductDraft,
): Promise<PublishResult> {
  const colours = draft.colours.length ? draft.colours : ["Default"];
  const sizes = draft.sizes.length ? draft.sizes : ["One size"];
  const price = String(draft.sellPrice ?? draft.costPrice ?? 0);

  const variants: any[] = [];
  for (const colour of colours) {
    for (const size of sizes) {
      variants.push({ price, options: [size, colour], inventoryPolicy: "CONTINUE" });
    }
  }

  const media = draft.photos
    .map((p) => p.url)
    .filter((u): u is string => Boolean(u))
    .map((url) => ({ originalSource: url, mediaContentType: "IMAGE" }));

  const tags = [draft.vendor, draft.productType].filter(Boolean) as string[];

  const d = await shopifyGql<any>(
    `mutation productCreate($input:ProductInput!,$media:[CreateMediaInput!]) {
       productCreate(input:$input, media:$media) {
         product { id }
         userErrors { field message }
       }
     }`,
    {
      input: {
        title: draft.suggestedTitle,
        vendor: draft.vendor ?? "UKSC",
        productType: draft.productType ?? undefined,
        status: "ACTIVE",
        tags,
        options: ["Size", "Colour"],
        variants,
      },
      media,
    },
  );

  const errors = d.data?.productCreate?.userErrors;
  if (errors?.length) {
    throw new Error(errors.map((e: any) => e.message).join(", "));
  }
  const productId: string | undefined = d.data?.productCreate?.product?.id;
  if (!productId) throw new Error("productCreate returned no product id");

  let addedToCollection = false;
  if (draft.collection) {
    const colId = await getCollectionId(draft.collection);
    if (colId) {
      await shopifyGql(
        `mutation add($id:ID!,$productIds:[ID!]!) {
           collectionAddProducts(id:$id, productIds:$productIds) { userErrors { message } }
         }`,
        { id: colId, productIds: [productId] },
      );
      addedToCollection = true;
    }
  }
  return { productId, addedToCollection };
}
