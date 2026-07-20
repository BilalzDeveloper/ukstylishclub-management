# Flow: Daily Catalog (multi-channel broadcast)

**Goal:** once a day, package the new arrivals into an attractive catalog and push
it to customers everywhere they are, each item linking to its Shopify page.

## Steps

1. **Trigger.** A scheduled job (`kind = "catalog"`, fired by `/api/jobs/run` on a
   cron) runs at the configured time.

2. **Collect items.** Gather `Product`s published since the last `BroadcastRun`
   (status PUBLISHED). Skip archived/out-of-stock.

3. **Render.** Build the catalog presentation: per-item image, title, price, and a
   deep link to the Shopify product. Produce a channel-appropriate form for each
   target (image cards + captions for chat channels; a Shopify collection on-store).

4. **Publish "Today's Drop" collection.** Create/refresh a Shopify collection with
   the day's items so the store itself has a landing page for the drop.

5. **Broadcast across channels.** For each configured `BroadcastChannel` adapter,
   send the catalog:
   - **TelegramChannel** — post to the public channel/group (`TELEGRAM_CATALOG_CHANNEL_ID`).
   - **TelegramDM** — DM registered customers who opted in.
   - **WhatsApp** — template/broadcast via the Meta WhatsApp Cloud API.
   - **Instagram** — post/story via the Meta Graph API.
   - **ShopifyCollection** — the on-store drop (from step 4).

6. **Log.** Record a `BroadcastRun` (date, channels, product ids, per-channel
   delivery stats).

## Design

- **`BroadcastChannel` interface** keeps each channel independent; adding a channel
  is a new adapter, not a change to the orchestrator.
- **Idempotent** — re-running a day's catalog must not double-post; the
  `BroadcastRun` record and a per-channel sent-marker guard against repeats.
- **Per-channel formatting** lives in the adapter; the orchestrator passes a neutral
  catalog model.

## Edge cases

- **No new items** → skip the broadcast, log an empty run.
- **Channel failure** → record the failure in stats and continue other channels;
  retry that channel's job rather than the whole run.
- **Rate limits** (WhatsApp/Instagram/Telegram) → chunk + backoff inside the adapter.

## Acceptance

At the scheduled time, the day's new products appear as a Telegram channel post and
an on-store collection (minimum viable), with WhatsApp/Instagram/DM added as those
adapters land — and each item links correctly to its Shopify product page.
