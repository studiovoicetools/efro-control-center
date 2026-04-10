import Link from "next/link";
import { getQualityReviewSnapshot } from "@/lib/efro-quality-review";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    shop: string;
  };
};

function card(title: string, value: string | number, subtitle?: string) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ fontSize: 12, color: "#93c5fd", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc" }}>{value}</div>
      {subtitle ? <div style={{ marginTop: 8, fontSize: 13, color: "#cbd5e1" }}>{subtitle}</div> : null}
    </div>
  );
}

function badge(text: string, kind: "good" | "warn" | "critical") {
  const map = {
    good: { bg: "#dcfce7", fg: "#166534" },
    warn: { bg: "#fef3c7", fg: "#92400e" },
    critical: { bg: "#fee2e2", fg: "#991b1b" },
  }[kind];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 800,
        background: map.bg,
        color: map.fg,
      }}
    >
      {text}
    </span>
  );
}

function sectionTitle(text: string) {
  return <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", marginBottom: 14 }}>{text}</div>;
}

function listCard(
  title: string,
  items: Array<{ title: string; detail: string; level: "good" | "warn" | "critical" }>
) {
  return (
    <section
      style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
      }}
    >
      {sectionTitle(title)}
      <div style={{ display: "grid", gap: 12 }}>
        {items.length === 0 ? (
          <div style={{ color: "#cbd5e1" }}>Noch keine Einträge vorhanden.</div>
        ) : (
          items.map((item, idx) => (
            <div
              key={`${title}-${idx}`}
              style={{
                border: "1px solid #334155",
                background: "#0f172a",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: "#f8fafc", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: "#cbd5e1", fontSize: 14 }}>{item.detail}</div>
                </div>
                {badge(item.level === "good" ? "stark" : item.level === "warn" ? "beobachten" : "kritisch", item.level)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default async function InternalQualityPage({ params }: PageProps) {
  const shopDomain = decodeURIComponent(params.shop || "").trim();
  const data = await getQualityReviewSnapshot(shopDomain);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020617 0%, #0f172a 100%)",
        color: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#60a5fa", letterSpacing: 0.3 }}>
              EFRO Internal Quality Center
            </div>
            <h1 style={{ margin: "8px 0 0", fontSize: 34, lineHeight: 1.1 }}>
              Qualitätslage für {shopDomain}
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "#cbd5e1", maxWidth: 820 }}>
              Hier siehst du frühzeitig, wo EFRO stark ist, wo EFRO schwach ist und worauf wir vor dem Kunden reagieren sollten.
            </p>
          </div>

          <div
            style={{
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: 18,
              padding: 18,
              minWidth: 280,
            }}
          >
            <div style={{ fontSize: 12, color: "#93c5fd" }}>Go-Live-Urteil</div>
            <div style={{ marginTop: 10 }}>{badge(data.verdict, data.verdict === "go_live_ready" ? "good" : data.verdict === "pilot_ready" ? "warn" : "critical")}</div>
            <div style={{ marginTop: 12, color: "#cbd5e1", fontSize: 14 }}>
              Nächste Aktion: {data.nextAction}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {card("Readiness Score", data.readinessScore, "Aus Health + Live-Signalen abgeleitet")}
          {card("Produkte", data.currentState.productCount, "Verfügbare Basis für Empfehlungen")}
          {card("Gespräche 24h", data.currentState.brainRequestCount24h, "Aktuelle Nutzungsintensität")}
          {card("Commerce-Aktionen", data.currentState.commerceActionCount, "Verkaufsnahe Signale")}
          {card("Duplikate", data.currentState.duplicateCandidateCount, "Katalog-Schwächen sofort sichtbar")}
          {card("Settings-Quelle", data.settingsSource, `Snapshot: ${data.snapshotSource}`)}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {listCard("Wo EFRO schon stark ist", data.strengths)}
          {listCard("Wo wir früh reagieren müssen", data.weaknesses)}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {listCard("Produktgruppen-Signale", data.productGroupSignals)}
          {listCard("Begriffe mit Trainingsbedarf", data.trainingSignals)}
        </div>

        <section
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
          }}
        >
          {sectionTitle("Direkte Werkzeuge")}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <Link href={data.links.merchant} style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 700 }}>
              Merchant Dashboard öffnen
            </Link>
            <Link href={data.links.handoff} style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 700 }}>
              Handoff öffnen
            </Link>
            <Link href={data.links.evidence} style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 700 }}>
              Evidence öffnen
            </Link>
            <Link href={data.links.config} style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 700 }}>
              Shop-Config öffnen
            </Link>
          </div>

          <div style={{ color: "#cbd5e1", fontSize: 14 }}>
            Status: {data.currentState.status} · letzter Sync: {data.currentState.lastSyncAt} · letzte Aktivität: {data.currentState.lastChatAt} · Commerce: {data.currentState.commerceLastStatus}
          </div>
        </section>
      </div>
    </main>
  );
}
