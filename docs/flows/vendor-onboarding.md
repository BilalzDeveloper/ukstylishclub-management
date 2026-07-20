# Flow: Vendor Onboarding (Telegram → Shopify)

**Goal:** a vendor sends photos over Telegram and an accurately-priced product
appears on Shopify, with a human only touching low-confidence cases.

## Steps

1. **Inbound message.** Vendor sends photo(s), optionally with a caption
   (price/details), to the bot. `/api/telegram/webhook` receives the update,
   verifies `TELEGRAM_WEBHOOK_SECRET`, and persists an `IngestionJob`
   (`source = TELEGRAM`, `state = RECEIVED`, full `rawPayload`).

2. **Vendor mapping.** Look up the sender's Telegram id against `Vendor.telegramUserId`.
   - Match → attach `vendorId`.
   - No match → leave `vendorId` null and raise a **vendor-approval** item; the job
     does not proceed to publish.

3. **AI analysis** (job, `state = ANALYZING`). `lib/ai` receives the images +
   caption and returns a structured spec: grouped images (one product even if
   several photos), title, description, category, attributes (size/colour), and any
   cost hint, plus a `confidence`. Stored in `parsedSpec`.

4. **Pricing.** Resolve the applicable `MarginRule` (most specific active rule) and
   compute `sellPrice` from `cost`. If no cost is known, flag for review.

5. **Branch on confidence.**
   - **High confidence** → `state = PUBLISHING`, publish straight to Shopify.
   - **Low confidence** → `state = REVIEW`; the draft waits in the review queue for
     a quick manager edit/approve.

6. **Publish to Shopify** (`state = PUBLISHING → PUBLISHED`). Create the product via
   the Admin GraphQL `productCreate`/`productSet` mutation — **ported from
   `legacy/onboarder/index.html`** (variants, size/colour options,
   `inventoryPolicy:'CONTINUE'`). Assign inventory to the vendor's **Shopify
   Location**. Store `shopifyProductId` on the `Product` and link it to the
   `IngestionJob`.

## Reuse

The legacy onboarder already builds the variant/option payload and calls the
product-create mutation; lift that into `lib/shopify` rather than rewriting it.

## Edge cases

- **Multiple messages = one product.** Group by sender + short time window before
  analysis so a burst of photos becomes a single listing.
- **Duplicate product.** Optionally compare against recent products by image
  similarity to avoid re-listing the same item.
- **Missing price.** Route to review; never publish a product with no `sellPrice`.
- **Unknown sender.** Stays in the approval queue; nothing is published.

## Acceptance

A registered vendor sending a clear photo with a price results in a live, correctly
priced Shopify product with **no human action**; an unclear or unpriced message
lands in the review queue instead.
