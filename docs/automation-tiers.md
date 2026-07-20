# Automation Tiers

The goal is **minimal human intervention**. Every step runs automatically unless
it hits one of a few deliberate judgment gates. This page is the canonical list of
what is automated and where a human is (intentionally) in the loop.

## Fully automated (no human)

| Step | What happens |
|------|--------------|
| Vendor mapping | Inbound Telegram sender id → matched to a registered `Vendor` |
| Product analysis | Photos + caption → AI listing (title, description, attributes) + confidence |
| Pricing | Margin rule turns vendor cost into sell price |
| Publish (high confidence) | Product created on Shopify, inventory on the vendor's Location |
| Daily catalog | New arrivals rendered and broadcast across all channels |
| Proof intake & matching | Screenshot → AI extracts amount/ref → matched to order |
| Courier dispatch | After approval, per-vendor pickups created via the provider |
| Tracking sync | Courier status → Shopify fulfillment status |
| Settlement math | Vendor payouts and profit snapshots computed |
| Order expiry | Unpaid orders auto-cancelled and restocked after the timeout |

## Human checkpoints (by design)

These surface as **small queues** in the dashboard, not a constant workload.

1. **Unknown-vendor approval.** A message from an unrecognised sender does **not**
   reach the live catalog. It waits in a vendor-approval queue until the manager
   registers or rejects the sender.

2. **Low-confidence product review.** When AI confidence is below threshold, the
   draft listing waits in a review queue for a quick edit/approve instead of
   auto-publishing.

3. **Daily order batch approval — the main checkpoint.** Orders with submitted
   payment proof collect into a daily queue. The manager reviews the matches at a
   glance and approves the batch. Approval **both** confirms payment (marks paid in
   Shopify) **and** authorises courier dispatch. This is the deliberate
   money-and-shipping gate; it is intentionally human.

Everything outside these three is exceptions-only (e.g. a failed courier pickup, a
proof mismatch, a vendor stock-out) — handled when they occur, not as routine.

## Dialing automation up over time

The system can move work from "human checkpoint" to "fully automated" as trust
grows:

- Raise the **confidence threshold** so more listings auto-publish.
- Auto-approve **clean-match orders** (amount + reference matched, known reliable
  customer), leaving only mismatches for the manager.
- Auto-register **returning vendors/customers** by prior history.

Each of these is a config/threshold change, not a re-architecture — the
checkpoints are switches, not walls.
