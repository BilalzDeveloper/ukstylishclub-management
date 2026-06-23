# ADR 0003 — Payments: prepaid transfer/wallet + proof (no gateway)

**Status:** Accepted · **Date:** 2026-06-23

## Context

The shop owner prefers **not** to integrate a payment gateway. We still need to
collect money reliably before shipping and avoid credit risk. The market supports
bank transfers and mobile wallets, and customers can share a transfer screenshot.

## Decision

Use **prepaid bank transfer / mobile wallet with proof verification**:

1. Shopify **manual payment method** "Bank Transfer / Wallet" (built in, no gateway,
   no fees) — order created *payment pending*.
2. Customer transfers and sends a **screenshot**.
3. **AI/OCR** extracts amount + reference and matches it to the order total;
   image-hash detects reused screenshots.
4. **Manager approves the daily batch**, which marks the order paid in Shopify and
   releases it to fulfillment.

Money is always collected **before** dispatch.

## Alternatives considered

- **Cash on Delivery (COD).** Viable and common, but carries higher return/abandon
  risk and requires the courier to handle cash remittance/reconciliation. Rejected
  as default because prepaid eliminates credit risk; COD could be added later as an
  option if a courier supports remittance.
- **A payment gateway.** Explicitly declined by the owner.
- **Prepaid with purely manual proof checking.** Rejected: defeats the
  minimal-intervention goal; AI does the reading, the human only confirms.

## Consequences

- Zero gateway fees and zero gateway integration.
- A proof step adds checkout friction (mostly on the customer) and needs the AI
  matching pipeline + risk controls (tolerance, duplicate detection, auto-expiry).
- The manager's batch approval is the deliberate money gate — acceptable and even
  desirable as the single human checkpoint.
- Reconciliation is straightforward: matched proof → mark paid → settle.
