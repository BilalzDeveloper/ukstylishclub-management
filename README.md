# Store OS — Autonomous Shopify Store Manager

An operating system for running a reseller business on top of Shopify with
**minimal human intervention**. Vendors send products over Telegram, AI turns
them into Shopify listings, a daily catalog goes out across multiple channels,
customers order and pay by transfer (proof verified automatically), the manager
approves the day's batch, and a pluggable courier collects from each vendor and
delivers.

> This repository grew out of **`uksc-onboarder`** (the original single-file
> product-onboarding tool, now preserved in [`legacy/onboarder/`](legacy/onboarder/)).
> It is being expanded into the full business-model management system described below.

## The Loop

```
Vendors ──Telegram──▶ AI analysis ──▶ Shopify (vendor = Location)
                                          │
                                          ▼
                          Daily multi-channel catalog
              (Telegram channel + DMs, WhatsApp/Instagram, Shopify collection)
                                          │
                                          ▼
   Customer orders ──▶ prepaid transfer/wallet + proof ──▶ AI verifies proof
                                          │
                                          ▼
                 Manager approves the day's batch  ◀── the one human checkpoint
                                          │
                                          ▼
        Pluggable courier collects per vendor → consolidates → delivers
                                          │
                                          ▼
                          Settlement + profit reporting
```

## Status

**Phase: planning & scaffolding (docs now, code later).** This repo currently
contains the architecture documentation, the data model, and an organized—but
intentionally empty—code skeleton. Implementation lands milestone by milestone
per [`docs/roadmap.md`](docs/roadmap.md).

## Where to start reading

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

## Stack (recommended)

TypeScript · Next.js (App Router) · Postgres + Prisma · grammY (Telegram) ·
Shopify Admin GraphQL API · Claude multimodal AI · Meta WhatsApp/Instagram ·
pluggable courier providers. See [`docs/architecture.md`](docs/architecture.md).

## Quickstart (once code lands)

```bash
pnpm install
cp .env.example .env        # fill in credentials
pnpm prisma migrate dev     # create the database schema
pnpm dev                    # dashboard + webhooks on http://localhost:3000
```
