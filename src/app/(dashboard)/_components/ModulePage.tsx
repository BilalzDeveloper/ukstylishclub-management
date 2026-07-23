import { MODULES } from "@/config/modules";

interface Step {
  t: string;
  d: string;
}

export interface ModulePageProps {
  moduleId: string;
  lede: string;
  steps: Step[];
  spec?: string; // docs path
  todaySkill?: string; // chat skill that does this now
}

export default function ModulePage({
  moduleId,
  lede,
  steps,
  spec,
  todaySkill,
}: ModulePageProps) {
  const mod = MODULES.find((m) => m.id === moduleId)!;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 className="page">
          {mod.icon} {mod.label}
        </h1>
        <span className="pill scaffold dot mono">{mod.milestone} · SCAFFOLDING</span>
      </div>
      <p className="lede">{lede}</p>

      <div className="steps">
        {steps.map((s, i) => (
          <div className="step" key={i}>
            <span className="num mono">{i + 1}</span>
            <div className="body">
              <div className="t">{s.t}</div>
              <div className="d">{s.d}</div>
            </div>
            <span className="pill scaffold mono st">planned</span>
          </div>
        ))}
      </div>

      {todaySkill && (
        <div className="banner">
          <b>Available now.</b> Until this surface ships, the same job runs today
          through a Claude session — ask for{" "}
          <span className="mono">{todaySkill}</span>. This page will replace the
          manual step with a built-in view.
        </div>
      )}

      {spec && (
        <p className="lede" style={{ marginTop: 18, fontSize: 13 }}>
          Spec: <span className="mono">{spec}</span>
        </p>
      )}
    </>
  );
}
