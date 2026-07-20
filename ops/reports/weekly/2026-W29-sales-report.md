# UKSC weekly sales report — 2026-W29 (14–20 July run, weeks compared: 13–19 Jul vs 6–12 Jul)

First report produced by the `weekly-sales-report` skill, from live ShopifyQL
data (store: UK Stylish Club, `uk-stylish.myshopify.com` / www.ukstylishclub.com).

## Headline

| Metric | This week (13–19 Jul) | Last week (6–12 Jul) | Change |
|--------|----------------------|----------------------|--------|
| Orders | 0 | 3 | −3 |
| Gross sales | £0 | £343 | −£343 |
| Net sales | −£55 (a return on 18 Jul) | £50 (£343 gross − £293 returned 12 Jul) | — |
| Average order value | — | £114.33 | — |
| Sessions | 4,957 | 5,012 | ≈ flat |
| Sessions adding to cart | 24 | 31 | −7 |
| Completed checkouts | 0 | 3 | −3 |

**⚠ The two findings that matter more than the totals:**

1. **Traffic is healthy but nothing converts.** ~700 sessions/day and a few
   cart-adds every single day, yet zero completed checkouts since 9 July. That
   pattern (carts but no checkouts, for 11 straight days) suggests a checkout
   problem — payment method, shipping settings, or checkout error — or that the
   traffic is low-quality/bot. This needs investigating before any marketing
   spend or effort.
2. **Recent sales were effectively all refunded.** £343 gross (6–8 Jul) was
   followed by −£293 returned on 12 Jul and −£55 on 18 Jul — net ≈ £0 for the
   fortnight. If these were test orders, fine; if real refunds, the reason
   matters (product quality? delivery?).

## Top products (last week with sales, 6–12 Jul)

| Product | Gross | Orders |
|---------|-------|--------|
| Shoes men | £60 | 1 |
| Shoes | £55 | 1 |
| Bag | £55 | 1 |
| Tshirt | £50 | 1 |
| Slipper | £45 | 1 |
| Necklace | £40 | 1 |
| Perfume | £38 | 1 |

(3 orders containing 7 products — multi-item baskets.)

## By collection / By vendor

Not meaningful this period: net sales round to zero, and live product titles
are generic ("Shoes", "Tshirt", "Bag") with no vendor codes — so vendor-tag
slicing has nothing to bite on. Note: the live catalog does **not** follow the
`<Vendor> <Brand> <Type>` convention the legacy onboarder used; the
`store-health-check` and `seo-refresh` skills should look at the real catalog
before assuming.

## Stock warnings

None — no sales volume to threaten stock this week.

## Suggested actions

1. **Investigate checkout, today.** Place a real test order end-to-end on
   www.ukstylishclub.com from a phone. If checkout works, the traffic quality
   is the suspect — check Sessions by referrer/country next report.
2. **Check the two July refunds** (12 & 18 Jul) — if they were real customer
   returns, find out why before driving more orders into the same problem.
3. **Run `store-health-check`.** Generic titles like "Shoes" and "Tshirt"
   suggest the live catalog needs description/title/collection work before the
   channel playbook's Google Shopping step.
