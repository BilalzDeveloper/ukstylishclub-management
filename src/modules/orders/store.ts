// Orders (read-only mirror for now). Seeded with samples — including a multi-vendor
// order — to exercise the split-fulfillment logic. The payment-proof and daily
// batch-approval parts of order-to-cash (M4) are intentionally deferred until the
// store's payment method is resolved (see ops/reports/2026-07-20-checkout-investigation.md).

export interface OrderLine {
  title: string;
  vendor: string | null;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  name: string; // e.g. #5002
  customer: string;
  createdAt: string; // ISO
  financialStatus: "paid" | "pending" | "voided";
  fulfillmentStatus: "unfulfilled" | "in_pickup" | "fulfilled";
  lines: OrderLine[];
}

const g = globalThis as unknown as { __uksc_orders?: Order[] };
const orders: Order[] = (g.__uksc_orders ??= seed());

export function listOrders(): Order[] {
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function setFulfillment(id: string, status: Order["fulfillmentStatus"]): void {
  const o = orders.find((x) => x.id === id);
  if (o) o.fulfillmentStatus = status;
}

function seed(): Order[] {
  const iso = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
  return [
    {
      id: "o-5002", name: "#5002", customer: "Jordan P.", createdAt: iso(3),
      financialStatus: "paid", fulfillmentStatus: "unfulfilled",
      lines: [
        { title: "Rag Trainers", vendor: "Rag", qty: 1, price: 34.99 },
        { title: "Siim T-shirt", vendor: "Siim", qty: 2, price: 16.99 },
      ],
    },
    {
      id: "o-5001", name: "#5001", customer: "Alex M.", createdAt: iso(9),
      financialStatus: "paid", fulfillmentStatus: "unfulfilled",
      lines: [{ title: "Cho Joggers", vendor: "Cho", qty: 1, price: 23.99 }],
    },
  ];
}
