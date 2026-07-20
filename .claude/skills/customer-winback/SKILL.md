---
name: customer-winback
description: Find lapsed UKSC customers and draft win-back outreach. Use when the owner asks to win back customers, re-engage lapsed buyers, or run a retention campaign. Segments customers, proposes (never auto-creates) a discount, and drafts email + SMS copy.
---

# Customer win-back

Output: `ops/engagement/winback/YYYY-MM-DD-winback.md`. Voice:
`docs/brand-voice.md`.

## Step 1 — Segment

- Confirm the lapse window with the owner (default: last order **>60 days**
  ago, at least 1 order ever).
- Pull customers via `list-customers` / `graphql_query` (need: name, email,
  order count, last order date, total spent; last ordered categories if cheap).
- Split: **one-time buyers** vs **repeat customers** (2+ orders). Report
  segment sizes and what they bought.
- If the store is young and segments are tiny (<10), say so and suggest
  revisiting in N weeks instead of over-engineering — but still draft the copy
  if the owner wants it.

## Step 2 — Propose the incentive (approval gate)

Default proposal: 10% code `COMEBACK10`, 14-day expiry, one use per customer.
Show the proposal (code, %, expiry, eligible segment) and **only call
`create-discount` after an explicit yes.** Record the created code in the run
file. If the owner declines a discount, draft the copy without one (new-drop
angle instead).

## Step 3 — Draft outreach

Per segment, in brand voice:
- **Email**: subject + body. Reference what they bought where possible ("More
  trainers just landed"). Repeat buyers get a warmer "we noticed you've been
  away"; one-timers get a strong reason to come back (new drop + code).
- **SMS variant**: ≤160 characters, same offer, plain.

## Step 4 — Sending instructions + wrap up

The store has no email platform beyond Shopify. Include a short "how to send"
section: Shopify admin → Marketing → Create campaign → Shopify Email; paste the
draft; choose the matching customer segment (give the exact segment filter,
e.g. "placed an order, last order before <date>"). Commit the run file, push,
and give the owner the segment sizes + next step in chat.
