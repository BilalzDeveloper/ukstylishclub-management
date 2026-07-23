// Central registry of the store-management surfaces.
// Both the sidebar and the overview page render from this, so the console
// always reflects the roadmap (docs/roadmap.md) in one place.

export type Status = "scaffolding" | "live";

export interface ModuleDef {
  id: string;
  label: string;
  path: string;
  icon: string;
  group: "Operations" | "Growth" | "Money";
  milestone: string; // roadmap milestone that delivers it
  status: Status;
  blurb: string;
}

export const MODULES: ModuleDef[] = [
  {
    id: "vendors",
    label: "Vendors",
    path: "/vendors",
    icon: "🏷️",
    group: "Operations",
    milestone: "M2",
    status: "scaffolding",
    blurb:
      "27 supplier codes: approve pending senders and link each vendor to its own Shopify Location (ADR-0002).",
  },
  {
    id: "products",
    label: "Products",
    path: "/products",
    icon: "👕",
    group: "Operations",
    milestone: "M1",
    status: "scaffolding",
    blurb:
      "Telegram submissions → AI draft → review queue → published. Low-confidence drafts wait for a human.",
  },
  {
    id: "catalog",
    label: "Daily catalog",
    path: "/catalog",
    icon: "📣",
    group: "Growth",
    milestone: "M3",
    status: "scaffolding",
    blurb:
      "Bundle the day's arrivals and broadcast across Telegram, WhatsApp/Instagram, and the 'Today's Drop' collection.",
  },
  {
    id: "approvals",
    label: "Approvals",
    path: "/approvals",
    icon: "✅",
    group: "Money",
    milestone: "M4",
    status: "scaffolding",
    blurb:
      "The one human checkpoint: review the day's matched orders and approve the batch — confirming payment and releasing dispatch.",
  },
  {
    id: "orders",
    label: "Orders",
    path: "/orders",
    icon: "🧾",
    group: "Money",
    milestone: "M4",
    status: "scaffolding",
    blurb:
      "Mirror Shopify orders with payment-proof and fulfillment status through the order-to-cash lifecycle.",
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: "📊",
    group: "Money",
    milestone: "M6",
    status: "scaffolding",
    blurb:
      "Sales, margin, profit, per-vendor performance, and the catalog → order → proof → delivered funnel.",
  },
];

export const GROUPS: ModuleDef["group"][] = ["Operations", "Growth", "Money"];

export const STORE = {
  name: "UK Stylish Club",
  domain: "uk-stylish.myshopify.com",
  storefront: "www.ukstylishclub.com",
  currency: "GBP",
};
