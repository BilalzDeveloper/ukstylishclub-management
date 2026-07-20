---
name: telegram-onboarding
description: Onboard new products from the UKSC Telegram bot into Shopify. Use when the owner asks to onboard products, check Telegram, or process new vendor submissions. Pulls photo+caption submissions, classifies them, produces an approval review sheet, and publishes only approved products.
---

# Telegram product onboarding

Pipeline: Telegram submissions → parse + classify → review sheet → owner
approval → Shopify products. Read `docs/telegram-intake.md` and the store
profile in `CLAUDE.md` first.

## Preconditions

- `TELEGRAM_BOT_TOKEN` env var must be set. If missing, stop and ask the owner
  to add it as an environment secret (never paste it in chat/files).
- Read the offset from `ops/onboarding/state.json` (`telegram_last_update_id`).

## Step 1 — Fetch new submissions

```bash
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates?offset=<last_update_id + 1>&timeout=0"
```

- Collect messages that contain photos. Group messages sharing a
  `media_group_id` into ONE product (albums). A photo message with no
  `media_group_id` is its own product.
- Track the highest `update_id` seen — even for non-photo messages — for the
  new offset.
- If there are no new submissions, say so, leave state untouched, and stop.

## Step 2 — Download photos and parse captions

- For each photo, take the largest size:
  `getFile?file_id=…` → `https://api.telegram.org/file/bot$TELEGRAM_BOT_TOKEN/<file_path>`,
  download into `scratch/onboarding/<date>/`.
- Parse the caption tolerantly for: **vendor** (match against the 27 codes in
  CLAUDE.md, case-insensitive), **cost price** (`£24.99`, `24.99`, `£45`),
  **sizes** (`S-XL`, `UK 7-11`, comma lists), **quantity** (`Qty 12`, `x12`).
  Unrecognised fields → leave blank for review; never guess a price.
- If the sender/chat maps to a known vendor but the caption names none, use the
  sender mapping and note it.

## Step 3 — Classify each product from its photos

Read the downloaded images directly. For each product determine: brand,
product type (one of the types in CLAUDE.md's collection mapping), colours,
style name, footwear vs apparel, and a confidence note. Then derive:

- **Title**: `<Vendor> <Brand> <Type> <Style>` (current store convention).
- **Collection**: via the type → collection mapping in CLAUDE.md.
- **Variants**: sizes from caption if given, else S–XXL (apparel) or UK 6–12
  (footwear); Colour option from classification.
- **Selling price**: if the caption price is the vendor cost, propose a selling
  price and SHOW the margin explicitly (e.g. "cost £18 → sell £24.99, margin
  £6.99"). If no margin guidance exists yet, ask the owner what margin to apply
  and record their answer in the run file for next time.

## Step 4 — Review sheet (approval gate — never skip)

Write `ops/onboarding/runs/YYYY-MM-DD-run.md`: run metadata (update-id range,
counts), then one section per product — photo filenames, parsed caption,
classification, proposed title/collection/variants/prices, and any flags
(missing price, unknown vendor, low confidence).

Present the sheet to the owner and ask which products to publish (all / list /
none, with edits). **Do not create anything in Shopify before an explicit yes.**

## Step 5 — Publish approved products

For each approved product, via the Shopify MCP:
1. Upload images (staged uploads).
2. `create-product`: title, vendor, product type, tags `[vendor, type]`,
   Size/Colour options and variants, price. The legacy app used
   `inventoryPolicy: 'CONTINUE'` — keep that unless the owner says otherwise.
3. Add to its collection (`add-to-collection`).
4. Record each created product's admin ID and URL in the run file.

## Step 6 — Close the loop

1. Update `ops/onboarding/state.json`: `telegram_last_update_id` = highest seen,
   `last_run` = today.
2. Commit the run file + state (+ push).
3. Offer to send a Telegram confirmation, e.g.
   `sendMessage` "✅ 12 products onboarded to UKSC" to the group/owner chat —
   only if the owner wants it.

## Failure notes

- `getUpdates` conflict (409): a webhook is set — ask before deleting it
  (`deleteWebhook`); the M1 system may own it.
- Updates older than ~24h are dropped by Telegram — if the owner mentions
  missing products, check whether the last run was too long ago and recommend
  daily runs (or accelerating the M1 webhook build).
- Unknown vendor code: include the product in the sheet flagged
  "unknown vendor — confirm before publish".
