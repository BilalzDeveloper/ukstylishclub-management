import { listDrafts } from "@/modules/onboarding/store";
import { shopifyConfigured } from "@/lib/shopify/client";
import { telegramConfigured } from "@/lib/telegram/bot";
import type { ProductDraft } from "@/modules/onboarding/types";
import { approveAction, rejectAction } from "./actions";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const drafts = listDrafts();
  const pending = drafts.filter((d) => d.status === "draft");

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 className="page">👕 Products — review queue</h1>
        <span className="pill scaffold dot mono">M1 · ONBOARDING</span>
      </div>
      <p className="lede">
        Telegram submissions become draft products here. AI parses the caption and
        classifies the photos; you approve or reject each one. Approving publishes it
        to Shopify with its variants and collection.
      </p>

      <div className="banner">
        <b>{pending.length} awaiting review.</b>{" "}
        {telegramConfigured()
          ? "Live intake is on — new submissions arrive at /api/telegram/webhook."
          : "Set TELEGRAM_BOT_TOKEN to receive live submissions; the drafts below are seeded samples."}{" "}
        {shopifyConfigured()
          ? "Approving creates a live Shopify product."
          : "Set SHOPIFY_ADMIN_ACCESS_TOKEN to publish for real — without it, approving just marks the draft published (no live product)."}
      </div>

      <div className="queue">
        {drafts.map((d) => (
          <DraftCard key={d.id} d={d} />
        ))}
      </div>
    </>
  );
}

function DraftCard({ d }: { d: ProductDraft }) {
  const isDraft = d.status === "draft";
  return (
    <div className={`draft ${d.status}`}>
      <div className="row1">
        <div className="thumb">🖼️</div>
        <div>
          <div className="name">{d.suggestedTitle}</div>
          <div className="sub mono">
            {d.vendor ?? "vendor?"} · {d.productType ?? "type?"} · {d.photos.length} photo
            {d.photos.length === 1 ? "" : "s"} · &ldquo;{d.captionRaw}&rdquo;
          </div>
        </div>
        <div className="spacer" />
        {d.status === "draft" ? (
          <Confidence value={d.confidence} />
        ) : (
          <span className={`status-tag ${d.status}`}>
            {d.status === "published" ? "✓ published" : "rejected"}
          </span>
        )}
      </div>

      <div className="attrs">
        <span><span className="k">Collection</span> {d.collection ?? "—"}</span>
        <span><span className="k">Sizes</span> {d.sizes.length ? d.sizes.join(", ") : "—"}</span>
        <span><span className="k">Colours</span> {d.colours.length ? d.colours.join(", ") : "—"}</span>
        <span className="price">
          <span className="k">Price</span> cost £{fmt(d.costPrice)} →{" "}
          <span className="sell">£{fmt(d.sellPrice)}</span>
        </span>
      </div>

      {d.flags.length > 0 && (
        <div className="flags">
          {d.flags.map((f) => (
            <span className="flag" key={f}>⚠ {f}</span>
          ))}
        </div>
      )}

      {d.shopifyProductId && (
        <div className="sub mono" style={{ marginTop: 10 }}>
          Shopify: {d.shopifyProductId}
        </div>
      )}

      {isDraft && (
        <div className="actions">
          <form action={approveAction}>
            <input type="hidden" name="id" value={d.id} />
            <button className="btn approve" type="submit">Approve &amp; publish</button>
          </form>
          <form action={rejectAction}>
            <input type="hidden" name="id" value={d.id} />
            <button className="btn reject" type="submit">Reject</button>
          </form>
        </div>
      )}
    </div>
  );
}

function Confidence({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <span className="conf mono">
      {pct}%
      <span className="bar">
        <i style={{ width: `${pct}%` }} />
      </span>
    </span>
  );
}

function fmt(n: number | null): string {
  return n == null ? "—" : n.toFixed(2);
}
