# Architecture

## One app, clear seams

A single deployable **Next.js (App Router)** application serves both the admin
dashboard and the webhook/API endpoints, backed by **Postgres** via **Prisma**.
Long-running and scheduled work runs through a small **DB-backed job queue**.

```
            ┌──────────────────────────── Next.js app ────────────────────────────┐
 Telegram ──▶ /api/telegram/webhook ┐                                              │
 Shopify  ──▶ /api/shopify/webhook  ├─▶  modules/ (domain logic) ──▶ Prisma ──▶ Postgres
 Meta     ──▶ /api/meta/webhook     ┘            │                                  │
 Cron     ──▶ /api/jobs/run ────────────────────┘                                  │
            │                                                                       │
 Manager  ──▶ /(dashboard)  ◀── reads/writes via modules ───────────────────────────
            └───────────────────────────────────────────────────────────────────────┘
                         │                        │                       │
                         ▼                        ▼                       ▼
                 providers/channels/      providers/fulfillment/    lib/ai (Claude)
                 (Telegram, WhatsApp,     (ApiCourier,              lib/shopify
                  Instagram, Shopify)      MessageDispatch,
                                           SelfDelivery)
```

## Layers

- **`src/app/api/*`** — thin transport handlers. Verify signatures, parse the
  payload, enqueue a job or call a module. No business logic here.
- **`src/app/(dashboard)`** — the admin UI (vendors, products, catalog, the daily
  approvals queue, analytics).
- **`src/modules/*`** — the domain logic, one folder per capability. Pure-ish
  functions over Prisma; this is where the rules live.
- **`src/providers/*`** — swappable integrations behind interfaces:
  - **`FulfillmentProvider`** — how a pickup/delivery is dispatched.
  - **`BroadcastChannel`** — how the catalog reaches a given channel.
- **`src/lib/*`** — low-level clients: `shopify` (Admin GraphQL), `telegram`
  (grammY), `meta` (WhatsApp/Instagram), `ai` (Claude), `db` (Prisma client).
- **`prisma/`** — the schema and migrations.

## Why this shape

- **Single deploy** keeps a solo operator productive; no service mesh to run.
- **Webhooks + a job queue** decouple slow work (AI analysis, broadcasts, courier
  calls) from the inbound request, so Telegram/Shopify get a fast 200.
- **Provider interfaces** isolate the two parts most likely to change (courier,
  channels), so swapping a courier or adding a channel doesn't touch core logic.
- **Modules over a monolith file** make each capability independently buildable
  along the roadmap.

## Background jobs

A `JobRun` table acts as the queue. `/api/jobs/run` is hit by a scheduler (Vercel
Cron or similar) and processes due jobs: AI ingestion, the daily catalog build +
broadcast, payment-proof matching, order-expiry/restock, and tracking sync. Start
here; introduce BullMQ/Redis only if throughput demands it.

## AI usage

`lib/ai` wraps the Anthropic API for two jobs:
1. **Product extraction** — photos + caption → structured listing + confidence.
2. **Payment-proof reading** — screenshot → amount/reference/payer + match.

Routine cases use a fast, cheap model (`AI_MODEL_FAST`); only low-confidence or
ambiguous cases escalate to a stronger model (`AI_MODEL_SMART`) to control cost at
volume.

## External integrations

| Integration | Library / API | Used for |
|-------------|---------------|----------|
| Shopify | `@shopify/admin-api-client` (GraphQL) | products, locations, orders, fulfillment, collections |
| Telegram | grammY | vendor intake, customer proof, DM catalog |
| Meta | WhatsApp Cloud API + Instagram Graph API | catalog broadcast (see `Facebook-Apps` repo) |
| Claude | `@anthropic-ai/sdk` | product extraction, proof OCR |
| Courier | provider adapters | pickups & delivery (pluggable) |

## Deployment topology

- **App:** Vercel (dashboard + webhooks + cron).
- **Database:** managed Postgres (Neon / Supabase).
- **Secrets:** environment variables (see `.env.example`); Meta app credentials
  managed in the companion `Facebook-Apps` repo.

These are documented recommendations; nothing is provisioned in the docs phase.
