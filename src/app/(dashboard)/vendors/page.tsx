import ModulePage from "../_components/ModulePage";

export default function VendorsPage() {
  return (
    <ModulePage
      moduleId="vendors"
      lede="The 27 supplier codes behind the catalog. Each vendor holds their own stock and maps to a dedicated Shopify Location, so a multi-vendor order can split itself for per-vendor pickup later."
      spec="src/modules/vendors + docs/adr/0002-vendor-as-location.md"
      steps={[
        { t: "Vendor directory", d: "List all vendors with their code, linked Shopify Location, and reliability score." },
        { t: "Approve pending senders", d: "Unknown Telegram senders land in a queue; approve one to bind it to a vendor." },
        { t: "Link Shopify Location", d: "Create or link a Location per vendor so inventory and fulfillment split correctly." },
      ]}
    />
  );
}
