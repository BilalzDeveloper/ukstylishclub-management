# Integration: Courier / Fulfillment Providers

The delivery company is **undecided and may change**, so the courier sits behind a
**`FulfillmentProvider`** interface. Swapping or adding a courier is a new adapter,
not a change to core logic.

## The interface (conceptual)

A `FulfillmentProvider` accepts a neutral **pickup request** and returns a
**dispatch result**:

```
PickupRequest {
  orderRef
  vendor:   { name, pickupAddress, contact }
  customer: { name, deliveryAddress, contact }
  items:    [{ title, quantity }]
  notes
}

DispatchResult {
  pickupRef        // courier id or message/draft reference
  trackingNumber?  // if known at dispatch
  trackingUrl?
}
```

It also exposes a way to **report/poll status** that maps onto `FulfillmentStatus`
(REQUESTED → PICKED_UP → IN_TRANSIT → DELIVERED/FAILED).

## Planned adapters

| Adapter | When to use | How it dispatches |
|---------|-------------|-------------------|
| **MessageDispatch** | courier has no API (default, safest) | auto-drafts the pickup request and sends it to the courier via Telegram/WhatsApp/email; status updated manually in the dashboard |
| **ApiCourier** | courier exposes an API/portal | creates pickups and pulls tracking programmatically |
| **SelfDelivery** | you deliver yourselves | produces pickup/delivery run sheets |

## Multi-vendor orders

Each order produces one `Fulfillment` (and one pickup request) **per vendor
Location**. A provider declares whether it **consolidates** multiple pickups into a
single delivery or delivers separately; the orchestrator tracks each leg regardless.

## Choosing the first adapter

`MessageDispatch` needs nothing from the courier and lets the whole loop work end to
end immediately. Move to `ApiCourier` once a specific courier with an API is chosen
— only the adapter changes, not the flow.
