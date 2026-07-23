import ModulePage from "../_components/ModulePage";

export default function ProductsPage() {
  return (
    <ModulePage
      moduleId="products"
      lede="Where Telegram submissions become Shopify listings. Photos and a caption come in, AI drafts the product, and low-confidence drafts wait in a review queue before anything is published."
      spec="src/modules/onboarding + docs/flows/vendor-onboarding.md"
      todaySkill="telegram-onboarding"
      steps={[
        { t: "Intake", d: "Group album photos into one product and parse the caption for price, sizes, quantity, vendor." },
        { t: "AI draft", d: "Multimodal model infers brand, type, colours, title, and collection with a confidence score." },
        { t: "Review queue", d: "Low-confidence drafts surface here for a quick human fix; confident ones can auto-publish." },
        { t: "Publish to Shopify", d: "Create the product with variants and options, assigned to the vendor's Location." },
      ]}
    />
  );
}
