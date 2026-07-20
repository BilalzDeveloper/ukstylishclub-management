# Ukstylishclub Management

The single repository for running **UK Stylish Club** (ukstylishclub.myshopify.com):
one place that covers every function of managing the store — product onboarding,
marketing, customer engagement, sales analytics, and SEO — with the goal of
**minimal human intervention**. Vendors send products over Telegram, AI turns
them into Shopify listings, a daily catalog goes out across multiple channels,
customers order and pay by transfer (proof verified automatically), the manager
approves the day's batch, and a pluggable courier collects from each vendor and
delivers.

> This repository grew out of **`uksc-onboarder`** (the original single-file
> product-onboarding tool, now preserved in [`legacy/onboarder/`](legacy/onboarder/)).

## The two layers

1. **The system** (`src/`, `prisma/`, `docs/`) — the autonomous store-management
   application, built milestone by milestone per [`docs/roadmap.md`](docs/roadmap.md)
   (M0 scaffolding → M1 Telegram onboarding → … → M6 settlement & analytics).
2. **The Claude workspace** (`CLAUDE.md`, `.claude/skills/`, `ops/`) — usable
   **today**, before the system code lands. Open a Claude Code session on this
   repo and ask for store work in plain language; skills drive the live store
   through the Shopify MCP and the Telegram Bot API, and write their outputs
   into `ops/`.

## Map of the repo (features as subfolders)

| Folder | Function |
|--------|----------|
| [`docs/`](docs/) | Vision, business model, architecture, roadmap, flows, integrations, ADRs |
| [`src/`](src/) | System code skeleton — one module per feature (onboarding, pricing, catalog, payments, fulfillment, settlement, dashboard) |
| [`prisma/`](prisma/) | Data model |
| [`.claude/skills/`](.claude/skills/) | Chat-driven skills: telegram onboarding, sales reports, win-back, campaigns, SEO, social + curated marketing playbooks |
| [`ops/onboarding/`](ops/onboarding/) | Product-intake runs (Telegram → review → Shopify) and intake state |
| [`ops/marketing/`](ops/marketing/) | Campaigns, social content batches, email drafts |
| [`ops/engagement/`](ops/engagement/) | Customer win-back segments and outreach |
| [`ops/reports/`](ops/reports/) | Weekly sales reports and store health checks |
| [`ops/seo/`](ops/seo/) | SEO audits and applied rewrites |
| [`legacy/onboarder/`](legacy/onboarder/) | The original Drive-based onboarder (retired at M2) |

## What you can ask a Claude session to do

- "Onboard the new products from Telegram" — pulls vendor submissions, classifies
  photos, shows a review sheet, publishes approved products to Shopify.
- "Run my weekly sales report" · "Who hasn't ordered in 60 days? Win them back"
- "Launch a campaign for the new drop" · "Write this week's social posts"
- "Audit the T-Shirts collection for SEO" · "Run a store health check"

Start with [`docs/channel-playbook.md`](docs/channel-playbook.md) for the
go-to-market order of operations, and [`docs/working-with-claude.md`](docs/working-with-claude.md)
for the session workflow that keeps this repo conflict-free.

## Rules

- **No secrets in this repo — ever.** Tokens (`TELEGRAM_BOT_TOKEN`, Shopify keys)
  live in Claude Code environment settings or `.env` (gitignored).
- Every write to the live store (product create/update, discounts, prices) is
  shown to the owner for approval before it happens.
- Commit and push before ending any Claude session — see
  [`docs/working-with-claude.md`](docs/working-with-claude.md).

## Where to start reading (the system blueprint)

| Doc | What it covers |
|-----|----------------|
| [`docs/vision.md`](docs/vision.md) | The big picture and the autonomous loop |
| [`docs/business-model.md`](docs/business-model.md) | Economics: cost → margin → payout → profit |
| [`docs/architecture.md`](docs/architecture.md) | System design, stack, deploy topology |
| [`docs/automation-tiers.md`](docs/automation-tiers.md) | What's automated vs. the human checkpoints |
| [`docs/data-model.md`](docs/data-model.md) | Entities and relationships |
| [`docs/roadmap.md`](docs/roadmap.md) | Phased build order (M0–M6) |
| [`docs/flows/`](docs/flows/) | Step-by-step specs for each flow |
| [`docs/integrations/`](docs/integrations/) | Telegram, Shopify, Meta, courier |
| [`docs/adr/`](docs/adr/) | Architecture decision records |

## Stack (system, once code lands)

TypeScript · Next.js (App Router) · Postgres + Prisma · grammY (Telegram) ·
Shopify Admin GraphQL API · Claude multimodal AI · Meta WhatsApp/Instagram ·
pluggable courier providers. See [`docs/architecture.md`](docs/architecture.md).

```bash
pnpm install
cp .env.example .env        # fill in credentials
pnpm prisma migrate dev     # create the database schema
pnpm dev                    # dashboard + webhooks on http://localhost:3000
```
