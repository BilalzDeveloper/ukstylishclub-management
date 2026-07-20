---
name: social-content
description: Write UKSC's weekly Instagram/TikTok content batch. Use when the owner asks for social posts, captions, or this week's content. Produces a 7-day posting plan from real store products in brand voice.
---

# Social content batch

Output: `ops/marketing/social/YYYY-MM-DD-batch.md`. Voice and hashtag rules:
`docs/brand-voice.md`. This is the always-on sibling of `new-drop-campaign` —
lighter, weekly.

## Step 1 — Theme and products

- Infer the theme, in priority order: new arrivals (latest
  `ops/onboarding/runs/`), best sellers (latest `ops/reports/weekly/`),
  seasonal angle, or owner's stated theme.
- Pull 3–6 real products via `search_products` (titles, prices, images).

## Step 2 — The 7-day plan

Default cadence (from `docs/channel-playbook.md`): 3–4 IG posts + 2–3 TikToks
per week. For each day:

| Field | Content |
|-------|---------|
| Day + platform | e.g. Mon — Instagram post |
| Format | post / carousel / reel / story / TikTok |
| Product(s) | which, with price |
| Caption | full text, brand voice, quiet CTA |
| Hashtags | 5–10 per brand-voice rules |
| Visual | which product photos to use (from the Telegram submission photos / Shopify images), simple shot or layout note |

TikTok entries get: hook, 3–6 shot list, on-screen text. Keep captions
copy-paste ready — no placeholders like "[insert product]".

## Step 3 — Wrap up

Commit + push. In chat: the week's theme in one line and the first post ready
to copy today.
