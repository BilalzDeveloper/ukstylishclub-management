# Business Model & Economics

## Who's who

- **Shop owner / manager** — operates the store, approves orders, gets paid the margin.
- **Vendors** — supply the goods and hold stock. Each is a registered `Vendor`
  (and a Shopify Location). They send products via Telegram and get paid their cost.
- **Customers** — discover products through the daily catalog, order on Shopify,
  pay by transfer/wallet.
- **Courier** — collects from vendors and delivers to customers (pluggable provider).

## The money flow

```
Customer pays sellPrice ──▶ Shop (held)
                              │
                              ├─▶ Vendor payout = cost      (per item)
                              ├─▶ Courier fee               (per delivery)
                              └─▶ Margin = sellPrice − cost − fees  (shop profit)
```

Because customers **prepay**, the shop is never out of pocket: money arrives
before the courier is dispatched, before the vendor is paid. This removes credit
risk and is what makes the gateway-free model safe.

## Pricing

`sellPrice` is derived from `cost` by a **MarginRule**:

- **Percent markup:** `sellPrice = cost × (1 + markupValue)` (e.g. 40% → ×1.4).
- **Fixed markup:** `sellPrice = cost + markupValue`.
- **Floor price:** never sell below this.
- **Target margin:** optional guardrail used to flag thin-margin items.

Rules have a **scope** (global, per-vendor, or per-collection) and a **priority**
so the most specific active rule wins. The original onboarder's "global price"
control becomes the GLOBAL-scope rule here.

## Settlement

- **Vendor payouts** are batched per period (e.g. weekly) into a `VendorPayout`
  with the summed `cogsTotal`. Since the cost is snapshotted on each `OrderLine`
  at sale time, payouts are exact even if the listing price later changes.
- **Profit** is recorded per period as a `ProfitSnapshot` (revenue, COGS, margin,
  per-vendor breakdown) feeding the analytics dashboards.

## Why no payment gateway works here

The owner prefers not to integrate a gateway. We support this with **prepaid
bank transfer / wallet + proof** (see ADR-0003):

- Shopify's **manual payment method** ("Bank Transfer / Wallet") needs no gateway
  and charges no fees.
- The customer transfers and uploads a screenshot; AI reads and matches it.
- The manager confirms in the daily batch before anything ships.

Trade-off vs. a gateway: a little more friction at checkout and a manual proof
step, in exchange for **zero gateway fees and zero gateway integration**. The
proof step is largely automated, so the friction falls mostly on the customer,
not the operator.

## Key risks & mitigations

| Risk | Mitigation |
|------|------------|
| Fake / reused payment proof | AI amount+reference match, image-hash duplicate detection, manager batch confirm |
| Customer never pays | Order auto-expires and restocks after `ORDER_PAYMENT_EXPIRY_MINUTES` |
| Vendor out of stock after sale | Vendor confirms at pickup; reliability score tracks failures; refund flow |
| Multi-vendor delivery cost eats margin | Courier fee modelled per delivery; target-margin guardrail flags thin orders |
| Unknown/unverified vendor spam | New senders land in a vendor-approval queue, not the live catalog |
