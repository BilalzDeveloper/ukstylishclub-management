# UKSC channel playbook — where to market, in what order

Opinionated go-to-market for a menswear store starting from **zero channels**.
The order matters: each step is cheap, uses what we already have (product
photos arriving daily via Telegram, a Claude workspace that writes everything),
and earns the right to the next step.

## Now — Week 1

### 1. Instagram + TikTok, organic
Menswear is visual and the 18–35 UK audience discovers fashion here. The photos
already exist (every Telegram submission), and the `social-content` skill
writes every caption, hashtag set, and TikTok shot list.

- Cadence: **3–4 IG posts + stories, 2–3 TikToks per week.** Consistency beats
  volume.
- Handle, bio link to the store, price in the caption (price-proud — see
  `docs/brand-voice.md`).

### 2. Shopify Email (free tier) — not Klaviyo yet
Built into Shopify admin: 10,000 free sends/month, native customer segments,
zero setup. The `customer-winback` and `new-drop-campaign` skills produce
paste-ready drafts.

- Turn on a signup incentive: 10% off first order (create the code via the
  workspace when ready).
- Revisit Klaviyo only when automation genuinely matters: rule of thumb
  **>1–2k subscribers or >£10k/month** — before that it's cost and complexity
  for nothing.

## Weeks 2–4

### 3. Google Shopping free listings
Install the **Google & YouTube app** in Shopify and sync the product feed —
free product listings for people already searching "Nike tee UK".

- **Run `seo-refresh` first.** Titles like "Siim Nike T-shirt Classic" lead
  with an internal vendor code; Google reads "Siim" as the brand and the
  listing underperforms. Fix titles collection by collection, then sync.

## Later — only after organic proves demand

### 4. Paid ads (Meta first)
**Do not start here.** Paid traffic to an unproven store burns cash. When
organic shows what sells: Meta retargeting (site visitors + engagers) first,
prospecting later. The vendored `ads` and `ad-creative` skills carry the
playbooks when the time comes.

### Skip for now
Blog/content SEO (slow payoff for a solo operator), marketplaces, paid
influencers (product gifting to UK micro-creators is fine and cheap).

## The weekly operating rhythm

| When | Do |
|------|----|
| Daily (or every other day) | "onboard the new products from Telegram" |
| Monday | "run my weekly report" |
| Tuesday | "write this week's social posts" |
| Every drop | "launch a campaign for the new drop" |
| Monthly | "win back lapsed customers" + "run a store health check" |

Each row is one message to a Claude session on this repo. The report's three
suggested actions each week tell you if this playbook needs adjusting.
