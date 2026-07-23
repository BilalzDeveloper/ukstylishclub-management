import { buildCatalog } from "@/modules/catalog/build";
import { listRuns } from "@/modules/catalog/store";
import { telegramChannel } from "@/providers/channels/telegram";
import { broadcastAction } from "./actions";

export const dynamic = "force-dynamic";

export default function CatalogPage() {
  const catalog = buildCatalog();
  const runs = listRuns();
  const live = telegramChannel.configured();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 className="page">📣 Daily catalog</h1>
        <span className="pill scaffold dot mono">M3 · BROADCAST</span>
      </div>
      <p className="lede">
        The day&apos;s approved products, gathered into a drop and broadcast across
        channels — each item linking to its Shopify page. Telegram first; WhatsApp,
        Instagram and a &ldquo;Today&apos;s Drop&rdquo; collection plug in behind the
        same interface.
      </p>

      <div className="banner">
        <b>{catalog.items.length} item{catalog.items.length === 1 ? "" : "s"} in the drop.</b>{" "}
        {live
          ? "Telegram channel is configured — broadcasting posts live."
          : "Set TELEGRAM_BOT_TOKEN + TELEGRAM_CATALOG_CHANNEL_ID to post live; broadcasting now logs a dev run without sending."}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20, alignItems: "center" }}>
        <form action={broadcastAction}>
          <button className="btn approve" type="submit">
            Broadcast the drop
          </button>
        </form>
        <span className="sub mono">{live ? "→ Telegram channel" : "→ dev run (not sent)"}</span>
      </div>

      <div className="grid">
        {catalog.items.length === 0 && (
          <div className="card"><div className="desc">Nothing published yet — approve drafts on the Products page and they land here.</div></div>
        )}
        {catalog.items.map((i) => (
          <div className="card" key={i.id}>
            <div className="head">
              <span className="title"><span className="ico">🖼️</span>{i.title}</span>
              <span className="pill live mono">£{i.price?.toFixed(2) ?? "?"}</span>
            </div>
            <div className="desc">{i.collection ?? "—"} · {i.vendor ?? "vendor?"}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 15, marginTop: 30, marginBottom: 4 }}>Broadcast history</h2>
      {runs.length === 0 ? (
        <p className="lede" style={{ fontSize: 13 }}>No broadcasts yet.</p>
      ) : (
        <div className="steps">
          {runs.map((r) => (
            <div className="step" key={r.id}>
              <span className="num mono">{icon(r.status)}</span>
              <div className="body">
                <div className="t">{r.channel} · {r.itemCount} items</div>
                <div className="d">{r.note} · {new Date(r.at).toLocaleString("en-GB")}</div>
              </div>
              <span className={`pill mono st ${r.status === "sent" ? "live" : "scaffold"}`}>{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function icon(status: string): string {
  return status === "sent" ? "✓" : status === "failed" ? "✕" : "•";
}
