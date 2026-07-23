import ModulePage from "../_components/ModulePage";

export default function AnalyticsPage() {
  return (
    <ModulePage
      moduleId="analytics"
      lede="The numbers that run the business: sales, margin, profit, per-vendor performance, and the catalog → order → proof → delivered funnel."
      spec="src/modules/analytics + src/modules/settlement + docs/business-model.md"
      todaySkill="weekly-sales-report / store-health-check"
      steps={[
        { t: "Sales & margin", d: "Revenue, discounts, returns, and the margin between sell price and vendor cost." },
        { t: "Per-vendor performance", d: "Which vendors sell, their reliability, and payout totals." },
        { t: "Funnel & profit", d: "Conversion at each step and profit snapshots from delivered orders." },
      ]}
    />
  );
}
