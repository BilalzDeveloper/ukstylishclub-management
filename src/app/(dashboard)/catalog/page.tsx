import ModulePage from "../_components/ModulePage";

export default function CatalogPage() {
  return (
    <ModulePage
      moduleId="catalog"
      lede="Once a day, the new arrivals are packaged into an attractive catalog and broadcast everywhere we reach customers — each item linking straight to its Shopify product page."
      spec="src/modules/catalog + docs/flows/daily-catalog.md"
      todaySkill="new-drop-campaign / social-content"
      steps={[
        { t: "Build the drop", d: "Gather the day's published products into a rendered catalog." },
        { t: "Broadcast", d: "Push across BroadcastChannel adapters — Telegram channel + DMs first, then WhatsApp/Instagram, plus a 'Today's Drop' Shopify collection." },
        { t: "Log the run", d: "Record each BroadcastRun with reach and status for the analytics funnel." },
      ]}
    />
  );
}
