---
name: store-health-check
description: Audit the UKSC Shopify store for catalog problems. Use when the owner asks for a store health check, store audit, or monthly cleanup. Finds products missing descriptions/images/collections, zero-inventory actives, and thin collections; outputs a fix-list.
---

# Store health check

Output: `ops/reports/health/YYYY-MM-DD-health.md`. Reads only — fixes are
delegated to the other skills. Run monthly, or before big campaigns.

## Checks (via `graphql_query` / built-in Shopify tools)

1. **Products with no description** — count + list (feeds `new-drop-campaign`
   step 2 / `seo-refresh`).
2. **Products with no image** — should be near-impossible via the Telegram
   flow; any hit is a broken onboarding run worth investigating.
3. **Active products with zero sellable inventory** across locations
   (`get-inventory-levels`) — customers can still order if
   `inventoryPolicy: CONTINUE`; flag for restock-check with the vendor or
   set to draft.
4. **Products in no collection** — invisible to collection browsing; propose
   the collection from the type mapping in CLAUDE.md.
5. **Product types outside the collection mapping** — new types that need a
   mapping decision.
6. **Thin collections** (<3 products) — look empty to customers; suggest
   merge/hide or a sourcing push to vendors.
7. **Missing SEO fields** — counts only (detail belongs to `seo-refresh`).

## Report format

Summary table (check, count, severity), then a per-check list of affected
products (title + admin link), then a **fix-list**: which skill or manual
action clears each finding, ordered by impact.

## Wrap up

Commit + push. In chat: the two most important findings and which skill to run
next.
