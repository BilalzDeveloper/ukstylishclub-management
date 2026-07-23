import { listOrders } from "@/modules/orders/store";
import type { Order } from "@/modules/orders/store";
import { splitByVendor } from "@/modules/fulfillment/split";
import { activeProviderName, providerConfigured } from "@/modules/fulfillment/dispatch";
import { requestPickupsAction } from "./actions";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  const orders = listOrders();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 className="page">🧾 Orders &amp; fulfilment</h1>
        <span className="pill scaffold dot mono">M5 · FULFILMENT</span>
      </div>
      <p className="lede">
        Orders mirrored from Shopify, each split into one pickup per vendor — because
        every vendor maps to its own Shopify Location (ADR-0002), a multi-vendor order
        natively becomes several pickups a courier collects separately.
      </p>

      <div className="banner">
        Provider: <b>{activeProviderName()}</b>.{" "}
        {providerConfigured()
          ? "Requesting pickups messages the vendor for real."
          : "Set TELEGRAM_BOT_TOKEN to dispatch for real; requesting now logs a dev run."}{" "}
        Payment-proof matching and the daily batch-approval checkpoint (M4) are deferred
        until the store&apos;s payment method is resolved.
      </div>

      <div className="queue">
        {orders.map((o) => (
          <OrderCard key={o.id} o={o} />
        ))}
      </div>
    </>
  );
}

function OrderCard({ o }: { o: Order }) {
  const pickups = splitByVendor(o);
  const total = o.lines.reduce((s, l) => s + l.price * l.qty, 0);

  return (
    <div className="draft">
      <div className="row1">
        <div>
          <div className="name">
            {o.name} · {o.customer}
          </div>
          <div className="sub mono">
            {new Date(o.createdAt).toLocaleString("en-GB")} · £{total.toFixed(2)} ·{" "}
            {pickups.length} pickup{pickups.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="spacer" />
        <span className={`status-tag ${o.financialStatus === "paid" ? "published" : "rejected"}`}>
          {o.financialStatus}
        </span>
        <span className="status-tag" style={{ marginLeft: 6 }}>{o.fulfillmentStatus.replace("_", " ")}</span>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {pickups.map((p) => (
          <div key={p.vendor} className="pickup">
            <span className="pu-vendor mono">{p.vendor}</span>
            <span className="pu-loc mono">
              {p.locationId ? `Location ${p.locationId}` : "⚠ no Location linked"}
            </span>
            <span className="pu-lines">
              {p.lines.map((l) => `${l.qty}× ${l.title}`).join(", ")}
            </span>
            <span className="pu-sub mono">£{p.subtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {o.fulfillmentStatus === "unfulfilled" && (
        <div className="actions">
          <form action={requestPickupsAction}>
            <input type="hidden" name="id" value={o.id} />
            <button className="btn approve" type="submit">
              Request {pickups.length} pickup{pickups.length === 1 ? "" : "s"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
