import Link from "next/link";
import { MODULES, GROUPS, STORE } from "@/config/modules";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <div className="logo mono">
            UK<b>SC</b>
          </div>
          <div className="sub">MANAGEMENT CONSOLE</div>
        </Link>

        <Link href="/" className="nav-item">
          <span className="ico">◎</span> Overview
        </Link>

        {GROUPS.map((group) => (
          <div key={group}>
            <div className="nav-group">{group}</div>
            {MODULES.filter((m) => m.group === group).map((m) => (
              <Link key={m.id} href={m.path} className="nav-item">
                <span className="ico">{m.icon}</span>
                {m.label}
              </Link>
            ))}
          </div>
        ))}
      </aside>

      <div className="main">
        <div className="topbar">
          <span className="pill scaffold dot mono">M0 · SCAFFOLDING</span>
          <span className="store">
            <b>{STORE.name}</b> · {STORE.domain} · {STORE.currency}
          </span>
        </div>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
