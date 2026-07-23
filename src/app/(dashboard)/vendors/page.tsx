import { listVendors } from "@/modules/vendors/store";
import type { Vendor } from "@/modules/vendors/store";
import { toggleStatusAction, linkLocationAction } from "./actions";

export const dynamic = "force-dynamic";

export default function VendorsPage() {
  const vendors = listVendors();
  const linked = vendors.filter((v) => v.shopifyLocationId).length;
  const active = vendors.filter((v) => v.status === "active").length;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 className="page">🏷️ Vendors</h1>
        <span className="pill scaffold dot mono">M2 · VENDORS</span>
      </div>
      <p className="lede">
        The {vendors.length} supplier codes behind the catalog. Each vendor holds
        their own stock and maps to a dedicated Shopify Location so multi-vendor
        orders split for per-vendor pickup (ADR-0002). Reliability tracks how their
        submissions perform over time.
      </p>

      <div className="stats">
        <div className="stat"><div className="k">Vendors</div><div className="v accent">{vendors.length}</div><div className="n">supplier codes</div></div>
        <div className="stat"><div className="k">Active</div><div className="v">{active}</div><div className="n">accepting submissions</div></div>
        <div className="stat"><div className="k">Location-linked</div><div className="v">{linked}</div><div className="n">split-fulfillment ready</div></div>
      </div>

      <div className="banner">
        Linking a Location is recorded here so the split-fulfillment model is wired;
        creating the actual Shopify Location is env-gated (needs a store token and
        address) and applied on the live store during setup.
      </div>

      <div className="vtable">
        <div className="vrow vhead mono">
          <span>Code</span><span>Status</span><span>Location</span><span>Reliability</span><span>Activity</span><span></span>
        </div>
        {vendors.map((v) => (
          <VendorRow key={v.code} v={v} />
        ))}
      </div>
    </>
  );
}

function VendorRow({ v }: { v: Vendor }) {
  return (
    <div className="vrow">
      <span className="vcode mono">{v.code}</span>
      <span>
        <span className={`status-tag ${v.status === "active" ? "published" : "rejected"}`}>
          {v.status}
        </span>
      </span>
      <span className="mono vloc">
        {v.shopifyLocationId ? (
          v.shopifyLocationId
        ) : (
          <form action={linkLocationAction}>
            <input type="hidden" name="code" value={v.code} />
            <button className="btn linkbtn" type="submit">Link Location</button>
          </form>
        )}
      </span>
      <span>
        <span className="conf mono">
          {Math.round(v.reliabilityScore * 100)}%
          <span className="bar"><i style={{ width: `${Math.round(v.reliabilityScore * 100)}%` }} /></span>
        </span>
      </span>
      <span className="mono vact">
        {v.submissions} sub{v.submissions === 1 ? "" : "s"}
        {v.lastSeenAt ? ` · ${new Date(v.lastSeenAt).toLocaleDateString("en-GB")}` : ""}
      </span>
      <span>
        <form action={toggleStatusAction}>
          <input type="hidden" name="code" value={v.code} />
          <input type="hidden" name="to" value={v.status === "active" ? "pending" : "active"} />
          <button className="btn" type="submit">
            {v.status === "active" ? "Suspend" : "Approve"}
          </button>
        </form>
      </span>
    </div>
  );
}
