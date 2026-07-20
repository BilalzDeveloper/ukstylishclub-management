# Flow: Fulfillment (vendor-split pickup → courier → delivery)

**Goal:** after approval, get the goods from each vendor to the customer — handling
multi-vendor orders automatically — through a courier we can swap out.

## The key idea: vendor = Shopify Location

Because each vendor's inventory lives on its **own Shopify Location**, a multi-vendor
order **splits natively into one fulfillment order per location**. We don't write
custom order-splitting logic; we read Shopify's fulfillment orders and act on each.
See [ADR-0002](../adr/0002-vendor-as-location.md).

## Steps

1. **Trigger.** An order reaches `status = APPROVED` (from the batch approval).

2. **Read fulfillment orders.** Fetch the order's Shopify fulfillment orders — one
   per vendor Location. Create a local `Fulfillment` per vendor
   (`status = PENDING`, `shopifyFulfillmentOrderId` set).

3. **Dispatch via provider.** For each `Fulfillment`, call the configured
   **`FulfillmentProvider`** adapter with a neutral pickup request (vendor pickup
   address, items, customer delivery address, order ref):
   - **ApiCourier** — create the pickup through the courier's API; store `pickupRef`.
   - **MessageDispatch** — auto-draft the pickup request and send it to the courier
     over Telegram/WhatsApp/email for them to action; store the draft ref.
   - **SelfDelivery** — generate a run sheet.
   Set `status = REQUESTED`.

4. **Consolidation (multi-vendor).** When an order has several vendors, the courier
   collects from each vendor and consolidates before delivering one parcel to the
   customer. The provider adapter expresses whether it consolidates or delivers
   separately; either way each leg is tracked on its `Fulfillment`.

5. **Tracking sync.** As the courier updates status (via API callback or a manual
   status update in the dashboard), advance the `Fulfillment`
   (REQUESTED → PICKED_UP → IN_TRANSIT → DELIVERED) and reflect it on the Shopify
   fulfillment order. When all of an order's fulfillments are DELIVERED, set
   `Order.status = DELIVERED`.

6. **Settlement handoff.** Delivered orders feed the settlement flow (vendor payouts
   + profit snapshot).

## Design

- **`FulfillmentProvider` interface** isolates the courier. The courier is undecided
  and may change, so adapters are first-class (ADR pending which courier ships first;
  `MessageDispatch` is the safe default needing no courier API).
- **Per-vendor `Fulfillment` records** keep multi-vendor orders auditable and make
  per-vendor reliability tracking possible.

## Edge cases

- **Vendor stock-out at pickup** → mark that `Fulfillment` FAILED, trigger
  partial-refund/reorder, decrement vendor `reliabilityScore`.
- **Failed delivery** → status FAILED + retry/return handling.
- **Partial delivery** of a multi-vendor order → order stays partially fulfilled
  until all legs complete.

## Acceptance

An approved single-vendor order produces one pickup request to the courier; an
approved two-vendor order produces two pickup requests that the courier consolidates
— with no manual order-splitting.
