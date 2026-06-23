# Integration: Meta (WhatsApp + Instagram)

WhatsApp and Instagram are **catalog broadcast** channels, reaching customers who
aren't on Telegram. Both go through Meta's Graph APIs and require a **Facebook App**.

## Where the app lives

The Meta app (App ID/secret, WhatsApp phone number, tokens, webhook config) is
managed in the companion **`Facebook-Apps`** repository. This repo references those
credentials via env (`META_*`) and calls the APIs from `lib/meta` + the channel
adapters.

## WhatsApp (Cloud API)

- Send the daily catalog as **template messages** or to opted-in recipients within
  the 24-hour customer-service window.
- Config: `META_WHATSAPP_PHONE_NUMBER_ID`, `META_WHATSAPP_ACCESS_TOKEN`.
- Inbound (optional): customers can send payment proof over WhatsApp →
  `/api/meta/webhook` (verified with `META_WEBHOOK_VERIFY_TOKEN`).

## Instagram (Graph API)

- Publish the drop as a **feed post or story** on the connected business account
  (`META_INSTAGRAM_BUSINESS_ACCOUNT_ID`), linking back to Shopify product pages.

## Adapters

Implemented as `WhatsApp` and `Instagram` `BroadcastChannel` adapters. Each handles
its own formatting, rate limits, and template/approval requirements. They are
**optional add-ons** in M3 — Telegram + Shopify collection are the minimum; Meta
channels extend reach once the Facebook app is approved.

## Approval caveats

WhatsApp message templates and some Instagram publishing require Meta review/
approval. Plan lead time; the system degrades gracefully (skip the channel, log it)
if a channel isn't yet approved.
