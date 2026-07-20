# Integration: Shopify

Shopify is the system of record for products, inventory, orders, and fulfillment.
Accessed through the **Admin GraphQL API** via `@shopify/admin-api-client`.

## Auth

A custom/private app on the store provides `SHOPIFY_ADMIN_ACCESS_TOKEN`. Configure
`SHOPIFY_STORE_DOMAIN` and `SHOPIFY_API_VERSION`. Webhooks are verified with
`SHOPIFY_WEBHOOK_SECRET` (HMAC).

## What we use

| Area | Operation | Notes |
|------|-----------|-------|
| Products | `productCreate` / `productSet`, media, variants | **port from `legacy/onboarder/index.html`** (size/colour options, `inventoryPolicy:'CONTINUE'`) |
| Locations | `locationAdd`, inventory activation | **one Location per vendor** (ADR-0002) |
| Inventory | set/activate at the vendor Location | drives multi-vendor split |
| Collections | create/update | the daily "Today's Drop" |
| Orders | `orders/create` webhook, `orderMarkAsPaid` | manual payment method; mark paid on approval |
| Fulfillment | fulfillment orders, `fulfillmentCreate`, tracking | one fulfillment order per Location |
| Payments | **manual payment method** "Bank Transfer / Wallet" | no gateway (ADR-0003) |

## Manual payment method (no gateway)

Enable a **manual payment method** in the store's payment settings labelled "Bank
Transfer / Wallet." Orders placed with it are created *payment pending*; we mark
them paid (`orderMarkAsPaid`) only after the manager approves the proof. No gateway,
no fees.

## Webhooks

- `orders/create` → mirror into local `Order` (see `flows/order-to-cash.md`).
- fulfillment/tracking updates → sync `Fulfillment` status.
- Verify HMAC against `SHOPIFY_WEBHOOK_SECRET` in `/api/shopify/webhook`.

## Tooling

During development, the **Shopify MCP tools** (`get-shop-info`, `create-product`,
`graphql_query`, `graphql_schema`) are handy to validate operations against a dev
store before wiring them into `lib/shopify`.

## Reuse from the legacy onboarder

`legacy/onboarder/index.html` already constructs the product-create payload
(variants, options, continue-selling) and calls the GraphQL mutation — lift that
logic into `lib/shopify` as the starting point for M1.
