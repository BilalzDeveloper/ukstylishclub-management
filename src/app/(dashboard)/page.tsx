import Link from "next/link";
import { MODULES } from "@/config/modules";

export default function OverviewPage() {
  return (
    <>
      <h1 className="page">Store operations</h1>
      <p className="lede">
        One console for running UK Stylish Club end to end — vendors send products
        over Telegram, AI turns them into listings, a daily catalog goes out across
        channels, and the manager approves the day&apos;s orders. This is the M0
        shell: the surfaces are wired and navigable; each fills in with its
        roadmap milestone.
      </p>

      <div className="stats">
        <div className="stat">
          <div className="k">Vendors</div>
          <div className="v accent">27</div>
          <div className="n">supplier codes to onboard</div>
        </div>
        <div className="stat">
          <div className="k">Surfaces</div>
          <div className="v">{MODULES.length}</div>
          <div className="n">operations · growth · money</div>
        </div>
        <div className="stat">
          <div className="k">Human checkpoints</div>
          <div className="v">1</div>
          <div className="n">daily order approval</div>
        </div>
        <div className="stat">
          <div className="k">Phase</div>
          <div className="v">M0</div>
          <div className="n">scaffolding · docs/roadmap.md</div>
        </div>
      </div>

      <div className="banner">
        <b>Live shell.</b> The app boots and every surface below is reachable.
        Business logic lands module by module (M1 onboarding → M6 settlement).
        The chat-driven skills in <span className="mono">.claude/skills/</span> already
        run these same jobs today via a Claude session, before this code takes over.
      </div>

      <div className="grid">
        {MODULES.map((m) => (
          <Link key={m.id} href={m.path} className="card">
            <div className="head">
              <span className="title">
                <span className="ico">{m.icon}</span>
                {m.label}
              </span>
              <span className="pill scaffold mono">{m.milestone}</span>
            </div>
            <div className="desc">{m.blurb}</div>
            <div className="meta">
              <span>{m.group}</span>
              <span>Open →</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
