# Vision

## What we are building

A store that **runs itself**. The shop manager's job shrinks from "do everything"
to "approve the day's orders and handle the occasional exception." Everything
else — sourcing listings from vendors, writing the listings, pricing them,
publishing them, marketing them daily, taking orders, checking payment, and
arranging delivery — is automated.

The business is a **reseller / marketplace-of-vendors** model: we don't hold
stock. Vendors hold the goods; we list them, sell them, collect payment, and pay
the vendor their cost. Our income is the margin between the sell price and the
vendor cost.

## The autonomous loop

1. **Vendors send products over Telegram.** A vendor photographs an item, sends
   the photos (and maybe a caption with price/details) to our Telegram bot. We
   recognise the sender and know which vendor it is.

2. **AI turns the message into a listing.** A multimodal model groups the photos
   into a single product, writes a title and description, infers attributes
   (size, colour), and reads any price/cost hint from the caption.

3. **We price it automatically.** A margin rule turns the vendor's cost into our
   sell price.

4. **We publish to Shopify.** The product goes live. Crucially, its inventory is
   assigned to that **vendor's own Shopify Location** — this is what lets a
   multi-vendor order split itself for pickup later (see ADR-0002).

5. **A daily catalog goes out everywhere.** Once a day, the new arrivals are
   packaged into an attractive catalog and broadcast across **every channel we
   reach customers on**: a Telegram channel, Telegram DMs, WhatsApp, Instagram,
   and a "Today's Drop" collection on the store itself. Each item links straight
   to its Shopify product page.

6. **Customers order and pay by transfer.** There is **no payment gateway** (by
   choice). The customer checks out on Shopify choosing "Bank Transfer / Wallet,"
   then sends a screenshot of the transfer as proof.

7. **AI verifies the proof.** The system reads the screenshot, extracts the
   amount and reference, and matches it to the order — flagging anything that
   doesn't line up or looks like a reused screenshot.

8. **The manager approves the day's batch.** This is the **one deliberate human
   checkpoint.** The manager reviews the matched orders at a glance and approves
   them as a batch. Approval both confirms payment and authorises dispatch.

9. **A courier collects and delivers.** For each vendor in the order, a pickup is
   arranged through a **pluggable courier provider**. If an order spans two
   vendors, the courier collects from both and consolidates before delivering to
   the customer.

10. **We settle and report.** Because payment is collected up front, vendor
    payouts (their cost) are simply tallied and paid out on a schedule, and the
    margin is recorded. Dashboards show sales, margins, profit, and per-vendor
    performance.

## Design principles

- **Minimal human intervention.** Automate the whole loop; reserve human judgment
  for a few gates (unknown vendor, low-confidence listing, daily order approval).
- **Use Shopify's native primitives.** Vendor = Location, manual payment methods,
  fulfillment orders — lean on what Shopify already does instead of rebuilding it.
- **Swappable edges.** The courier and the customer channels are the parts most
  likely to change, so both sit behind clean interfaces (`FulfillmentProvider`,
  `BroadcastChannel`).
- **AI for the tedious reading.** Vision/OCR does the repetitive interpretation
  (photos → listing, screenshot → payment), with confidence scores deciding when
  a human needs to look.
- **Exceptions, not babysitting.** The manager sees small queues of things that
  need a decision, never a firehose of routine work.

## What "done" looks like

A vendor sends three photos at 2pm. By the next morning the item is live, it went
out in last night's catalog, two customers have ordered and paid, the manager
tapped "approve" once over coffee, and a courier is on the way to the vendor — all
without anyone writing a product description or chasing a payment.
