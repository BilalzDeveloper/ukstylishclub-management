# Roadmap

Phased build order. Each milestone is independently shippable and leaves the system
in a working state. The current phase is **M0 (scaffolding)**; this repo holds the
docs and the empty skeleton.

## M0 — Foundation  ← we are here
- Repo skeleton, `prisma/schema.prisma`, `.env.example`, build configs.
- Next.js app boots; dashboard shell renders.
- Database connected; `prisma migrate dev` applies cleanly.
- `lib/db`, `lib/shopify`, `lib/telegram`, `lib/ai` client stubs wired.

## M1 — Vendor onboarding (Telegram → Shopify)
- `/api/telegram/webhook` receives vendor messages (grammY).
- Sender → `Vendor` mapping; unknown senders → approval queue.
- `lib/ai` product extraction → `IngestionJob` + draft `Product` + confidence.
- Review queue UI for low-confidence drafts.
- Publish to Shopify — **port the product-create GraphQL mutation from
  `legacy/onboarder/index.html`** (variants, size/colour options,
  `inventoryPolicy:'CONTINUE'`).

## M2 — Vendors & pricing
- Vendor CRUD; create/link a **Shopify Location per vendor** (ADR-0002).
- `MarginRule` engine (percent/fixed, floor, priority, scope).
- Auto-price on publish; "global price" rule replaces the onboarder's global field.

## M3 — Daily catalog (multi-channel)
- Catalog builder: gather the day's published products → rendered catalog.
- `BroadcastChannel` interface + adapters: TelegramChannel, TelegramDM first;
  then WhatsApp + Instagram (via the `Facebook-Apps` Meta app); ShopifyCollection.
- Scheduled broadcast job + `BroadcastRun` logging.

## M4 — Order-to-cash (prepaid + proof)
- Shopify **manual payment method** "Bank Transfer / Wallet"; `/api/shopify/webhook`
  on `orders/create`.
- Proof intake (Telegram/WhatsApp/order page) → `lib/ai` OCR → `Payment` match.
- Duplicate-proof detection; order auto-expiry + restock job.
- **Daily batch-approval UI** — the manager's one checkpoint; approval marks paid +
  releases to fulfillment.

## M5 — Fulfillment (pluggable courier)
- `FulfillmentProvider` interface + first adapter (likely `MessageDispatch`).
- Per-vendor pickup creation from Shopify fulfillment orders (Location split).
- Tracking sync back to Shopify fulfillment status.

## M6 — Settlement & analytics
- `VendorPayout` batching; `ProfitSnapshot` generation.
- Dashboards: sales, margin, profit, per-vendor performance, order funnel.
- Retire `legacy/onboarder/` once M1–M2 fully cover its function.

## Cross-cutting (as needed)
- Auth for the dashboard (`ADMIN_ALLOWLIST`).
- Observability/logging on the job queue.
- Escalation thresholds to dial automation up (see `automation-tiers.md`).
