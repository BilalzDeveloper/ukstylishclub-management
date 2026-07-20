---
name: seo-refresh
description: Audit and fix UKSC product SEO (titles, descriptions, meta). Use when the owner asks for an SEO audit, better titles, or product page optimization. One collection per run; produces a before/after table and applies approved changes in batches.
---

# SEO refresh

Output: `ops/seo/audits/YYYY-MM-DD-<collection>.md`. Methodology references:
vendored `seo-audit`, `ai-seo`, `schema` skills.

## Step 1 — Scope: ONE collection per run

Ask which collection (or pick the highest-traffic one from the latest weekly
report). One collection keeps the review sheet approvable in one sitting.

## Step 2 — Fetch

`graphql_query` products in the collection with: `title`, `handle`,
`descriptionHtml`, `seo { title description }`, `productType`, `vendor`, `tags`.

## Step 3 — Audit checklist (per product)

- **Vendor code leads the title** — "Siim Nike T-shirt Classic" is how the
  onboarder builds titles; search engines and Google Shopping read "Siim" as
  the brand. Propose customer-facing pattern: `<Brand> <Style> <Type> — <Colour>`
  e.g. "Nike Classic Tee — Washed Black" (keep the vendor in tags — the vendor
  tag, not the title, is the operational link; flag this dependency in the
  sheet so order-splitting logic keeps working).
- **Missing/empty description** (most onboarded products).
- **Missing SEO title/meta description** — propose pattern
  `Men's <Brand> <Type> UK | UK Stylish Club` and a ≤155-char meta with price.
- **No search keywords** — UK buyer phrasing ("men's tracksuit UK",
  "cheap Nike trainers UK").

## Step 4 — Before/after sheet (approval gate)

Table per product: current title/description/meta → proposed. Include a "risk"
column noting anything operational (vendor-in-title dependency, URL handle
stays unchanged — never rewrite handles of live products without explicit
discussion, it breaks links).

## Step 5 — Apply after approval

`productUpdate` via `graphql_mutation` (title, `descriptionHtml`, `seo` input),
in batches of ~10, confirming each batch succeeded. Record applied product IDs
in the audit file. Store-level gaps this skill can't fix (collection page
descriptions, blog, structured data at theme level) go in a final
"recommendations" section.

## Wrap up

Commit + push. In chat: how many products audited, how many applied, the single
biggest remaining SEO gap.
