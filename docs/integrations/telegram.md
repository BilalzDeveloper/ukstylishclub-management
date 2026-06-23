# Integration: Telegram

Telegram is the **vendor intake** channel, a **customer proof/DM** channel, and a
**catalog broadcast** channel. Implemented with **grammY**.

## Roles

| Role | Direction | Used in |
|------|-----------|---------|
| Vendor intake | inbound | vendors send product photos/captions |
| Customer payment proof | inbound | customers send transfer screenshots |
| Catalog — channel | outbound | post the daily drop to a public channel/group |
| Catalog — DM | outbound | DM opted-in customers |

## Setup

1. Create a bot via **@BotFather**; put the token in `TELEGRAM_BOT_TOKEN`.
2. Register the webhook to `/api/telegram/webhook` with a `secret_token`
   (`TELEGRAM_WEBHOOK_SECRET`); the handler must verify the
   `X-Telegram-Bot-Api-Secret-Token` header.
3. Add the bot to the catalog channel/group as an admin; set
   `TELEGRAM_CATALOG_CHANNEL_ID`.

## Inbound handling

- Identify the sender (`from.id`) → map to `Vendor.telegramUserId` or
  `Customer.telegramUserId`.
- **Photos** arrive as `photo` arrays (multiple sizes) — download the largest by
  `file_id` via `getFile`.
- **Bursts**: several photos for one product may arrive as separate updates or as a
  media group (`media_group_id`) — group by `media_group_id` (or sender + time
  window) before AI analysis.
- Route by sender role: vendor → ingestion flow; customer → payment-proof flow.

## Outbound (catalog)

Implemented as the `TelegramChannel` and `TelegramDM` `BroadcastChannel` adapters.
Respect rate limits (chunk + backoff). Use captions with product links; for many
items use an album/media group per chunk.

## Notes

- One bot can serve all roles; separate by sender identity and conversation state.
- Keep transport in `/api/telegram/webhook`; put logic in the relevant module.
