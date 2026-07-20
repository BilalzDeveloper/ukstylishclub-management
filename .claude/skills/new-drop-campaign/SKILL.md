---
name: new-drop-campaign
description: Build a full launch campaign for newly onboarded UKSC products. Use when the owner asks to promote a new drop, launch products, or market recent arrivals. Produces descriptions, social content, an email, and an optional launch offer.
---

# New-drop campaign

Output: `ops/marketing/campaigns/YYYY-MM-DD-<slug>/` containing `campaign.md`
(overview + descriptions), `social.md`, `email.md`. Voice:
`docs/brand-voice.md`.

## Step 1 — Scope the drop

- Default: products created in the last 7 days — check the latest
  `ops/onboarding/runs/` file first (it lists exactly what was onboarded), fall
  back to `search_products` / `graphql_query` filtered by `created_at`.
- Or the owner names the products/collection. Confirm the final list before
  writing.
- Pull titles, images, prices, collections via the Shopify MCP.

## Step 2 — Product descriptions (approval gate for store writes)

Onboarded products typically have **no customer-facing description**. Draft one
per product (structure and before/after examples in `docs/brand-voice.md`).
Show all drafts; after approval, apply via `update-product` in small batches.
Skip applying if the owner just wants the campaign content.

## Step 3 — Campaign kit

- **3 Instagram captions** (different angles: the hero product, the price
  story, the full-drop flat-lay), each with a hashtag set per brand-voice
  rules, each noting which product photos to use.
- **2 TikTok concepts**: hook (first 2 seconds), shot list (3–6 shots),
  on-screen text, sound suggestion type (trending/chill), CTA.
- **1 announcement email**: subject + body, one CTA button text, products with
  prices visible.
- **Optional launch offer**: propose only if the owner wants one (e.g.
  `DROP10`, 7 days). Same approval gate as always — never `create-discount`
  without a yes.

## Step 4 — Wrap up

Commit the campaign folder, push. In chat: 1-line campaign summary, where the
files are, and the suggested posting order/schedule (e.g. email day 1, IG posts
days 1/3/5, TikToks days 2/4).
