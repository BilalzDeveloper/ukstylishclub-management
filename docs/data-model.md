# Data Model

This page describes the entities and relationships. The authoritative schema is
[`prisma/schema.prisma`](../prisma/schema.prisma); keep the two in sync.

## Entity map

```
Vendor ──< Product ──< OrderLine >── Order >── Customer
  │           │                        │
  │           └─ IngestionJob          ├─ Payment (1:1)
  │                                     └─< Fulfillment >── Vendor
  ├─< MarginRule                                          (one per vendor/order)
  └─< VendorPayout

BroadcastRun   ProfitSnapshot   JobRun        (operational / reporting)
```

## Entities

### Vendor
A supplier. Also modelled as a **Shopify Location** (`shopifyLocationId`) so
multi-vendor orders split natively. Keyed to Telegram by `telegramUserId` for
intake. Has a `status` (PENDING/ACTIVE/PAUSED), pickup address, payout terms, lead
time, and a `reliabilityScore`.

### IngestionJob
One inbound vendor message. Stores the `rawPayload` (text + photo ids + sender),
the AI `parsedSpec`, a `confidence`, and a `state` (RECEIVED → ANALYZING → REVIEW →
PUBLISHING → PUBLISHED/FAILED). Links to the `Product` it produced.

### Product
A listing. Holds `cost` (vendor price), `sellPrice` (derived), the applied
`marginRule`, images/attributes, `status`, and `shopifyProductId` once published.
Belongs to a `Vendor`.

### MarginRule
A pricing rule: `scope` (GLOBAL/VENDOR/COLLECTION), `markupType`
(PERCENT/FIXED) + `markupValue`, optional `floorPrice`/`targetMargin`, and a
`priority` (most specific active rule wins).

### Customer
A buyer, with channel identifiers (Shopify, Telegram, WhatsApp, Instagram), an
address, and a `reliabilityScore`.

### Order / OrderLine
`Order` mirrors a Shopify order (`shopifyOrderId`, total, currency) and carries the
workflow `status` (PENDING_PAYMENT → PROOF_SUBMITTED → APPROVED → DISPATCHED →
DELIVERED / CANCELLED), the `approvedAt/By` audit, and an `expiresAt`. Each
`OrderLine` snapshots `unitPrice` **and** `unitCost` (for exact settlement) and the
resolved `vendorId` for routing.

### Payment
1:1 with an Order. Captures the proof image (+ `proofImageHash` for duplicate
detection), the AI-`extracted` amount/reference/payer, a `matchState`
(NONE/MATCHED/MISMATCH/DUPLICATE), and who verified it.

### Fulfillment
One per vendor per order. Records the provider used, the Shopify fulfillment-order
id, the courier `pickupRef`, tracking, and a `status`
(PENDING → REQUESTED → PICKED_UP → IN_TRANSIT → DELIVERED/FAILED).

### VendorPayout / ProfitSnapshot
Settlement and reporting rollups per period.

### BroadcastRun
A record of one daily catalog send: which channels, which products, delivery stats.

### JobRun
The DB-backed background-job queue row (`kind`, `payload`, `status`, `attempts`,
`runAfter`).

## Design notes

- **Cost is snapshotted on `OrderLine`** so vendor payouts stay correct even if a
  product's price/cost changes after the sale.
- **`vendorId` on each line** is what drives multi-vendor fulfillment splitting and
  per-vendor settlement.
- **Money state lives on `Payment.matchState` + `Order.status`** — the manager's
  batch approval is the transition that flips both to confirmed/approved.
