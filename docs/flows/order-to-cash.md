# Flow: Order to Cash (prepaid transfer/wallet + proof)

**Goal:** take an order without a payment gateway, confirm the money arrived, and
release it for shipping — with the manager's single batch approval as the gate.

## Steps

1. **Order placed.** Customer checks out on Shopify choosing the **manual payment
   method "Bank Transfer / Wallet."** Shopify creates the order as *payment pending*
   and fires `orders/create`.

2. **Mirror order.** `/api/shopify/webhook` verifies `SHOPIFY_WEBHOOK_SECRET` and
   creates a local `Order` (`status = PENDING_PAYMENT`) with `OrderLine`s. Each line
   snapshots `unitPrice` **and** `unitCost`, and resolves its `vendorId`. Set
   `expiresAt = now + ORDER_PAYMENT_EXPIRY_MINUTES`.

3. **Payment instructions.** The customer is shown/sent the transfer details
   (`PAYOUT_BANK_DETAILS`) and asked to send a screenshot of the transfer — via the
   Telegram/WhatsApp thread or an order-status page.

4. **Proof intake.** The screenshot arrives (webhook). Store it on `Payment`
   (`proofImageUrl`, `proofImageHash`).

5. **AI proof reading.** `lib/ai` extracts `extractedAmount`, `extractedRef`,
   `extractedPayer`. Compare against the order total within `PAYMENT_MATCH_TOLERANCE`
   and check the image hash against prior proofs:
   - amount matches & not seen before → `matchState = MATCHED`
   - amount off / unreadable → `MISMATCH`
   - hash reused → `DUPLICATE`
   Set `Order.status = PROOF_SUBMITTED`.

6. **Daily batch approval — the human checkpoint.** The dashboard shows a queue of
   `PROOF_SUBMITTED` orders grouped for the day, MATCHED ones pre-checked, MISMATCH/
   DUPLICATE flagged for a look. The manager approves the batch.

7. **On approval.** For each approved order: `mark order as paid` in Shopify, set
   `Order.status = APPROVED`, stamp `approvedAt/By` and `Payment.verifiedBy/At`, and
   **release to the fulfillment flow**.

8. **Expiry sweep.** A job cancels + restocks orders still `PENDING_PAYMENT` past
   `expiresAt` (and notifies the customer).

## Risk controls

- **Amount tolerance** avoids rejecting tiny rounding differences.
- **Duplicate detection** (image hash + reference) catches reused screenshots.
- **Manager confirm** is the backstop for anything AI flags.
- **Auto-expiry** frees stock from abandoned/unpaid orders.

## Dialing up automation

Once trusted, **clean MATCHED orders from reliable customers** can auto-approve,
leaving only MISMATCH/DUPLICATE for the manager (see `automation-tiers.md`).

## Acceptance

A customer who orders, transfers, and sends a correct screenshot ends up in the
manager's daily queue as a pre-checked MATCHED order; one tap approves payment in
Shopify and releases the order to fulfillment.
