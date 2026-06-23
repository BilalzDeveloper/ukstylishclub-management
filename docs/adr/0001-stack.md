# ADR 0001 — Stack: one Next.js app + Postgres/Prisma

**Status:** Accepted · **Date:** 2026-06-23

## Context

We need a backend (Telegram + Shopify + Meta webhooks), persistent state (vendors,
products, orders, payments, fulfillment, settlement), AI calls, scheduled work, and
an admin dashboard — operated by essentially one person. The legacy onboarder was a
single client-side HTML file with no persistence, which can't support orders,
payments, or fulfillment.

## Decision

Build a **single deployable Next.js (App Router) app in TypeScript** that hosts both
the admin dashboard and the webhook/API routes, backed by **Postgres via Prisma**,
with a **DB-backed job queue** for async/scheduled work. Integrations: grammY
(Telegram), `@shopify/admin-api-client` (Shopify), `@anthropic-ai/sdk` (Claude),
Meta Graph APIs (WhatsApp/Instagram). Deploy on Vercel + managed Postgres.

## Alternatives considered

- **Keep it client-side (like the onboarder).** Rejected: can't securely hold
  secrets, receive webhooks, persist state, or run schedules.
- **Separate backend service + separate frontend.** Rejected for now: more moving
  parts than a solo operator needs; Next.js API routes cover webhooks fine.
- **Full pnpm/Turborepo monorepo.** Rejected for now: premature; feature-folder
  modules in one app give separation without the overhead, and we can split later.
- **BullMQ/Redis queue from day one.** Deferred: a `JobRun` table is enough at
  current volume; introduce Redis only if throughput demands it.

## Consequences

- One repo, one deploy, fast to iterate.
- Clear seams (`modules`, `providers`, `lib`) so capabilities build independently.
- If scale demands, the job queue and channels/fulfillment providers can be peeled
  into separate services without reworking domain logic.
