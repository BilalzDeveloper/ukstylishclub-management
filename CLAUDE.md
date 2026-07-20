# Ukstylishclub Management — workspace guide

This repo is the single hub for running **UK Stylish Club**
(`ukstylishclub.myshopify.com`). It has two layers:

1. **The system blueprint** (`docs/`, `src/`, `prisma/`) — the autonomous
   store-management application being built per `docs/roadmap.md`. `src/` is
   still a skeleton; treat docs as design intent, not shipped behaviour.
2. **The ops workspace** (this file, `.claude/skills/`, `ops/`) — live today.
   Sessions do real store work through the Shopify MCP and the Telegram Bot API
   and write outputs into `ops/`.

Default assumption for a session on this repo: the owner wants store operations
help (onboarding, marketing, engagement, reports, SEO), not system coding —
unless they explicitly ask for roadmap/milestone implementation work.

**`legacy/onboarder/` is retired process.** It reads product photos from Google
Drive; the real intake is Telegram (below). Never treat the legacy app as the
current flow, and never modify it unless explicitly asked.

## Store profile

- **Store:** UK Stylish Club (UKSC), `ukstylishclub.myshopify.com`, prices in GBP, UK market.
- **What we sell:** affordable branded menswear/streetwear — tees, tracksuits,
  trainers, jeans, accessories; small unisex-bag and women's-fragrance lines.
  Reseller model: vendors hold the stock; our income is the margin
  (see `docs/business-model.md`).
- **Audience:** UK men roughly 18–35, style-conscious, price-sensitive,
  mobile-first, discovers fashion on Instagram/TikTok.
- **Collections** (type → collection mapping, from the legacy `COLLECTION_MAP`;
  verify against the live store before relying on it):
  - T-Shirts For Men (T-shirt, Top, Polo)
  - Boxers and Shorts (Shorts, Board/Swim/Sweat shorts, Boxers, Underwear)
  - Tracksuits For Men (Tracksuit, Joggers, Sweatpants, Hoodie, Jacket, Coat)
  - Trainers & Footwear (Trainers, Sneakers, Shoes)
  - Jeans (Jeans, Trousers)
  - Unisex Bags (Bag, Backpack) · Socks For Men · Perfumes For Her · Men Wallet & Bag (Wallet)
- **Vendors:** 27 codes — Siim, Sim, Son, Ad, Ahm, D, Fr, Alll, Al, Cho, Shii,
  Che, Mon, Afi, Sh, Zero, Dar, Nwdr, Zz, Mz, Za, Rag, Tag, Uptk, Daup, Ham,
  Oooo. The vendor code appears in product titles and tags.
- **Conventions:** titles `<Vendor> <Brand> <Type> <Style>` (note: vendor codes
  leading titles hurt SEO — the `seo-refresh` skill addresses this); tags
  `[vendor, productType]`; sizes S–XXL for apparel, UK 6–12 for footwear;
  options Size/Colour.

## Product intake: Telegram

Vendors and the UKSC worker send product submissions to the store's **Telegram
bot/group**: photos plus a caption with details (price, sizes, quantity,
vendor). The `telegram-onboarding` skill processes them; `docs/telegram-intake.md`
documents the setup and caption format. Google Drive is **not** part of the flow.

Access: Telegram Bot API over HTTPS (`curl`) using the `TELEGRAM_BOT_TOKEN`
environment variable (set as a secret in Claude Code environment settings). If
it's missing, ask the owner to add it — never ask them to paste the token into
chat or a file.

## Tools and when to use them

**Shopify MCP** (primary):
- Analytics/reports: `run-analytics-query` (ShopifyQL) for sales, orders, AOV,
  product performance.
- Catalog: `search_products`, `get-product`, `create-product`, `update-product`,
  collections tools; staged uploads for images.
- Customers/orders: `list-customers`, `list-orders`, `get-order`.
- Discounts: `create-discount` — **only after explicit owner approval**.
- Anything without a dedicated tool (SEO fields, metafields, pages, blogs):
  `graphql_query` / `graphql_mutation`.

**Telegram Bot API** (`curl` + `TELEGRAM_BOT_TOKEN`): `getUpdates` (offset in
`ops/onboarding/state.json`), `getFile` for photo downloads, `sendMessage` for
confirmations.

### Hard rules

1. **Reads are free; writes need approval.** Before any product create/update,
   price change, discount, or collection change on the live store, show the
   owner exactly what will change and get a yes.
2. **Never commit secrets** — no tokens, API keys, or credentials anywhere in
   the repo (this repo's content may be publicly served via GitHub Pages).
3. **Never modify `legacy/onboarder/`** unless explicitly asked.
4. **British English** in all customer-facing copy. Prices always in GBP.
5. **Commit and push before the session ends** — see
   `docs/working-with-claude.md`. Uncommitted work is lost and causes the
   branch divergence this repo has suffered before.

## Skills

Custom UKSC skills (in `.claude/skills/`): invoke by asking naturally.

| Skill | Ask for it like | Output |
|-------|-----------------|--------|
| `telegram-onboarding` | "onboard the new products from Telegram" | `ops/onboarding/runs/` |
| `weekly-sales-report` | "run my weekly report" | `ops/reports/weekly/` |
| `customer-winback` | "win back lapsed customers" | `ops/engagement/winback/` |
| `new-drop-campaign` | "launch a campaign for the new drop" | `ops/marketing/campaigns/` |
| `social-content` | "write this week's social posts" | `ops/marketing/social/` |
| `seo-refresh` | "SEO audit the T-Shirts collection" | `ops/seo/audits/` |
| `store-health-check` | "run a store health check" | `ops/reports/health/` |

Also vendored (curated from `coreyhaines31/marketingskills`, MIT — see
`.claude/skills/ATTRIBUTION.md`): copywriting, emails, social, SMS, SEO,
CRO, offers, launch, ads, analytics, A/B testing, marketing psychology,
customer research. Use them as methodology references when doing marketing work.

## Output conventions

- Finished work goes in `ops/<function>/`, date-prefixed:
  `YYYY-MM-DD-<topic>.md` (weekly reports: `YYYY-Www-sales-report.md`).
- Throwaway files go in `scratch/` (gitignored).
- Commit finished outputs with a short descriptive message and push.
- Voice and tone for all copy: `docs/brand-voice.md`. Channel strategy:
  `docs/channel-playbook.md`.
