# Telegram product intake

Products enter the store through Telegram. Vendors and the UKSC worker send
photos of items, with the details in the caption, to the store's Telegram
bot/group. This replaced the old Google Drive folder flow
(`legacy/onboarder/` — retired).

Two consumers of this intake:

1. **Today:** the `telegram-onboarding` Claude skill (`.claude/skills/telegram-onboarding/`)
   pulls new submissions on demand, classifies them, and — after the manager
   approves a review sheet — publishes them to Shopify.
2. **Later (roadmap M1):** the `/api/telegram/webhook` in `src/` receives the
   same messages in real time and runs the same pipeline automatically
   (see `docs/flows/` and `docs/integrations/`).

## Setup requirements

- **`TELEGRAM_BOT_TOKEN`** must be set as an environment secret in Claude Code
  environment settings (never in a file in this repo, never pasted into chat).
- The bot must be able to read vendor submissions. Either:
  - vendors/worker message the **bot directly** (simplest, always works), or
  - the bot is a **member of the vendor group** with *privacy mode disabled*
    (BotFather → Bot Settings → Group Privacy → Turn off), so it can read all
    group messages.
- Pull-based processing uses `getUpdates`; Telegram only retains unfetched
  updates for a limited time (roughly 24 hours). **Run the onboarding skill at
  least once a day.** If daily runs become a burden, that's the signal to build
  the M1 webhook, which receives messages instantly and never misses one.

## Submission format (share this with vendors)

One product per message (or one album of photos per product). Photos of the
item, plus a caption like:

```
Vendor / Price £X / Sizes S-XL / Qty N
```

Examples:

```
Siim / £24.99 / Sizes S-XXL / Qty 12
Rag / £45 / UK 7-11 / Qty 6 / Nike Air Max, black-white
```

Rules of thumb:
- **Price** is the vendor's price (our cost). Selling price is set by margin
  rules at review time (see `docs/business-model.md`).
- **Sizes** as a range (`S-XL`, `UK 6-12`) or a list (`M, L, XL`).
- Anything extra (brand, colours, style name) helps but isn't required — the AI
  reads the photos too.
- Captions are parsed tolerantly; anything unclear is left blank on the review
  sheet for the manager to fill in. Missing caption entirely = the product
  still gets classified from photos, with cost/quantity flagged for manual entry.

## What the manager sees

Each run produces a review sheet in `ops/onboarding/runs/YYYY-MM-DD-run.md`:
one row per product with the photos, the parsed caption, the AI's
classification (brand, type, colours, suggested title and collection), and the
proposed Shopify fields. Nothing is published until the manager approves —
that approval is the intake's one human checkpoint (consistent with
`docs/automation-tiers.md`).
