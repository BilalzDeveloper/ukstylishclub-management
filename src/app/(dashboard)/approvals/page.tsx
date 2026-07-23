import ModulePage from "../_components/ModulePage";

export default function ApprovalsPage() {
  return (
    <ModulePage
      moduleId="approvals"
      lede="The one deliberate human checkpoint. The manager reviews the day's matched orders at a glance and approves them as a batch — approval both confirms payment and authorises dispatch."
      spec="src/modules/orders + docs/flows/order-to-cash.md"
      steps={[
        { t: "Matched-orders queue", d: "Orders whose payment proof the AI has read and matched line up here for a single review." },
        { t: "Flags surfaced", d: "Anything that doesn't reconcile — wrong amount, reused screenshot — is flagged, not hidden." },
        { t: "Approve the batch", d: "One action marks the batch paid and releases it to fulfillment." },
      ]}
    />
  );
}
