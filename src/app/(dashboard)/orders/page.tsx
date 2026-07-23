import ModulePage from "../_components/ModulePage";

export default function OrdersPage() {
  return (
    <ModulePage
      moduleId="orders"
      lede="Every Shopify order mirrored with its payment-proof and fulfillment status, through the full order-to-cash lifecycle — placed, paid, approved, dispatched, delivered."
      spec="src/modules/orders + src/modules/payments + docs/flows/order-to-cash.md"
      todaySkill="weekly-sales-report"
      steps={[
        { t: "Mirror orders", d: "Sync Shopify orders and keep their lifecycle status current." },
        { t: "Payment proof", d: "Intake transfer screenshots, OCR the amount and reference, match to the order, flag duplicates." },
        { t: "Auto-expiry", d: "Unpaid orders expire and restock on a timer instead of lingering." },
      ]}
    />
  );
}
