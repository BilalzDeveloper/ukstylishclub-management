# Dashboard (admin UI)

The manager's surface. Planned routes/views:
- **vendors** — list, approve pending senders, link Shopify Locations
- **products** — drafts, review queue (low-confidence), published
- **catalog** — today's drop, broadcast status/history
- **approvals** — the daily order batch-approval queue (THE human checkpoint)
- **orders** — order + payment-proof + fulfillment status
- **analytics** — sales, margin, profit, per-vendor performance

UI only — all logic lives in src/modules/*. Auth gated by ADMIN_ALLOWLIST.
