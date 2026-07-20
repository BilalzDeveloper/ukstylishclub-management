# ADR 0002 — Model each vendor as a Shopify Location

**Status:** Accepted · **Date:** 2026-06-23

## Context

We don't hold stock; vendors do. An order can contain items from several vendors,
and the courier must collect from each vendor separately, then consolidate and
deliver. We need order data to express "which items come from which vendor" so
pickups can be arranged per vendor — without building a custom order-splitting
engine.

## Decision

Represent **each vendor as a Shopify Location**, and assign each product's inventory
to its vendor's Location. Shopify then **natively creates one fulfillment order per
Location** for any order. Multi-vendor orders split themselves; we just read the
fulfillment orders and dispatch one pickup per vendor.

## Alternatives considered

- **Custom splitting in our DB** (tag each line with a vendor and group ourselves).
  Rejected as the primary mechanism: re-implements what Shopify fulfillment orders
  already do, and diverges from Shopify's own fulfillment state. (We still snapshot
  `vendorId` on `OrderLine` for settlement/reporting, but fulfillment splitting
  rides on Locations.)
- **One Location, vendor as a product tag/metafield.** Rejected: doesn't produce
  per-vendor fulfillment orders, so multi-vendor pickup logic would be manual.

## Consequences

- Multi-vendor pickup falls out of Shopify primitives — less code, fewer bugs.
- Each vendor needs a Shopify Location created/linked (`Vendor.shopifyLocationId`),
  handled in M2.
- Inventory management is per-vendor-Location, matching reality (stock lives with
  the vendor).
- Caveat: very large vendor counts hit Shopify Location limits — revisit if vendors
  scale into the hundreds (could group low-volume vendors).
