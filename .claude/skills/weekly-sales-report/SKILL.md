---
name: weekly-sales-report
description: Produce the UKSC weekly sales report from live Shopify data. Use when the owner asks for the weekly report, how the store did, or sales numbers. Compares last 7 full days vs the prior 7 and writes a stable-format report with suggested actions.
---

# Weekly sales report

Output: `ops/reports/weekly/YYYY-Www-sales-report.md` (ISO week of the period's
end date). Keep the section headings identical every week so reports diff
cleanly. Use the Shopify MCP; reads only — this skill never writes to the store.

## Data to gather

1. **Headline, this week vs last** — `run-analytics-query` (ShopifyQL): total
   sales, order count, AOV by day for the last 14 full days; split into the two
   7-day windows.
2. **Top products** — top 10 by revenue and by units for the last 7 days.
3. **By collection / vendor** — sales grouped by product type or collection;
   vendor performance via the vendor tag (if ShopifyQL can't slice by tag, fall
   back to `list-orders` for the window and aggregate line items by their
   product's vendor field).
4. **Stock risk** — `get-inventory-levels` for this week's top sellers; flag
   anything likely to stock out.
5. Optional context if cheap to get: new customers vs returning.

**Zero/low-order weeks are normal for a young store.** Never pad or
extrapolate: report the true numbers, then focus the actions section on
demand-generation (content cadence, first campaign, SEO) rather than
restocking.

## Report format

```markdown
# UKSC weekly sales report — <YYYY-Www> (<date range>)

## Headline
| Metric | This week | Last week | Change |
(total sales, orders, AOV, new customers if available)

## Top products
(table: product, units, revenue)

## By collection
## By vendor
## Stock warnings
## Suggested actions
(exactly 3, each one line, concrete: "restock X", "run social-content on the
Tracksuits collection", "run customer-winback — N customers lapsed")
```

## Wrap up

Commit the report and push. Tell the owner the headline numbers and the three
actions in chat — don't make them open the file for the takeaway.
