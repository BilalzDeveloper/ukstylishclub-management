# Investigation: traffic but no checkouts since 9 July

Prompted by the W29 weekly report. Data: ShopifyQL sessions/sales funnels,
last 10 orders, abandoned checkouts, order #4969 event log, paid-order history.

## Finding 1 — The store has never collected a payment (the real problem)

- Checkout's payment method is **"Bank Deposit" (manual payment)**. Orders are
  placed, payment sits "pending", the transfer never arrives, and the orders
  are cancelled from admin days later (e.g. #4969: placed 8 Jul, cancelled
  12 Jul — "payment canceled, restocked, refunded, archived").
- The last 10 orders (27 Jun – 8 Jul): all real UK customers, **all VOIDED,
  all unfulfilled**. The "returns" in analytics (−£293 on 12 Jul, −£55 on
  18 Jul) are these cancellations, not product returns.
- **The last order with status "paid" is from July 2023 — and those were £0
  test orders.** The store has 3,969 orders all-time; demand exists, but the
  bank-transfer-only checkout converts to £0 collected.

Implication: even in a "good" week (~1 order/day placed), revenue is zero.
Either customers never receive/understand the transfer instructions, or they
simply won't pay by bank transfer. This must be fixed before any marketing
effort has a point.

## Finding 2 — Orders stopped entirely on 9 July

- Before 9 Jul: roughly 1 order/day (orders #4960–#4969). Since 9 Jul:
  **zero orders in 12 days**, only 1 abandoned checkout (14 Jul), 15 sessions
  reached checkout, 0 completed. Before 9 Jul, about half of
  reached-checkout sessions completed — 15 reaches with 0 completions is not
  chance; something at checkout changed around 9 July.
- Prime suspect: the Bank Deposit manual payment method was disabled or
  altered (~the same period the unpaid orders were being cancelled). Manual
  payment settings are not readable via the API — check **Shopify admin →
  Settings → Payments**. Shipping rates are the second suspect.

## Finding 3 — The "700 visitors/day" is mostly bots

- Sessions jumped from ~130/day to 600–1,400/day on exactly 9 July, while cart
  adds stayed flat (2–5/day) — thousands of extra "visitors" with zero extra
  product engagement.
- 83% of the last fortnight's traffic is "direct" (classic bot signature);
  the real audience is still the ~130/day baseline. Analytics after 9 July
  are polluted — don't base decisions on them. (A server-side fetch of the
  storefront was 403-blocked by Shopify bot protection, consistent with a
  bot wave.)

## Recommended actions, in order

1. **Check Settings → Payments in Shopify admin**: is the Bank Deposit manual
   method still active? Did anything change around 9 July? Then place a real
   test order from a phone to confirm checkout completes.
2. **Add a card payment option (Shopify Payments / PayPal).** Three years of
   orders with 0% payment completion is the strongest possible evidence that
   bank-transfer-only checkout doesn't work for this audience. This is the
   single biggest revenue unlock available. (The prepaid-proof model in
   docs/adr/0003 can still exist alongside cards.)
3. **If bank transfer stays**: put the account details and payment deadline in
   the manual payment method's "additional details" (shown at checkout and on
   the thank-you page), and follow up each pending order within hours — the
   current pattern is silence, then cancellation on day 4.
4. Treat session analytics since 9 July as contaminated; judge marketing by
   orders and cart adds, not sessions.
