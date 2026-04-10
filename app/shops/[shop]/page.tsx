import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/status-pill";
import { getShopDetailData } from "@/lib/ops-data";


export const dynamic = "force-dynamic";

type EfroAgentSummary = {
  shop?: string;
  supported?: boolean;
  enabled?: boolean;
  interval_seconds?: number;
  last_run_at?: string | null;
  has_run?: boolean;
  bootstrap_required?: boolean;
  summary_status?: string;
  ok?: boolean | null;
  degraded?: boolean | null;
  observed_failed_count?: number | null;
  failed_count?: number | null;
  public_health_consecutive_failures?: number | null;
  public_health_incident_threshold?: number | null;
  last_handoff_id?: string | null;
  last_public_health_error_at?: string | null;
  last_public_health_ok_at?: string | null;
  control_center_note?: string;
};

type EfroAgentState = {
  connected: boolean;
  source: string;
  summary: EfroAgentSummary | null;
  error: string | null;
};

async function fetchEfroAgentSummary(): Promise<EfroAgentState> {
  const baseUrl = process.env.EFRO_AGENT_BASE_URL?.trim() || "http://127.0.0.1:8000";
  const url = `${baseUrl}/api/watchdog/summary?shop=efro`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const resp = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      return {
        connected: false,
        source: baseUrl,
        summary: null,
        error: `http_${resp.status}`,
      };
    }

    const summary = (await resp.json()) as EfroAgentSummary;
    return {
      connected: true,
      source: baseUrl,
      summary,
      error: null,
    };
  } catch (error) {
    clearTimeout(timeout);
    return {
      connected: false,
      source: baseUrl,
      summary: null,
      error: error instanceof Error ? error.message : "unknown_error",
    };
  }
}

export default async function ShopDetailPage({
  params
}: {
  params: { shop: string };
}) {
  const shopDomain = decodeURIComponent(params.shop);
  const data = await getShopDetailData(shopDomain);

  if (!data.ok) return notFound();

  const {
    shop,
    alerts,
    source,
    globalAudioCacheEntryCount,
    globalAudioCacheHitCount
  } = data;

  const efroAgent = await fetchEfroAgentSummary();
  const efroSummary = efroAgent.summary;
  const efroSummaryStatus = efroSummary?.summary_status || "unknown";
  const efroSummaryColor =
    efroSummaryStatus === "green"
      ? "#1db954"
      : efroSummaryStatus === "yellow"
        ? "#f4b400"
        : efroSummaryStatus === "red"
          ? "#ff5a67"
          : "#7aa2ff";

  return (
    <main>
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">{shop.shopDomain}</h1>
            <p className="page-subtitle">
              Shop-Detailansicht für Phase 1 mit Status, Aktivität, Alerts und nächster Operator-Aktion.
            </p>
            <p className="small" style={{ marginTop: 10 }}>
              Datenquelle: <strong>{source === "supabase" ? "Supabase live" : "Mock-Fallback"}</strong>
            </p>
          </div>
          <div className="freeze-box">
            <div className="section-title">Status</div>
            <StatusPill status={shop.status} />
            <div className="small" style={{ marginTop: 12 }}>
              Priorität: <strong>{shop.priorityScore}</strong>
            </div>
          </div>
        </div>

        <section
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>
              EFRO Agent Primärstatus
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/api/ops/watchdog"
                style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 700 }}
              >
                /api/ops/watchdog
              </Link>
              <Link
                href={`/api/ops/handoff?shop=${encodeURIComponent(shop.shopDomain)}`}
                style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 700 }}
              >
                Handoff-Historie
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, color: "#93c5fd", marginBottom: 8 }}>Verbindung</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc" }}>
                {efroAgent.connected ? "verbunden" : "nicht verbunden"}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#cbd5e1" }}>
                {efroAgent.source}
              </div>
            </div>

            <div
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, color: "#93c5fd", marginBottom: 8 }}>Live-Summary</div>
              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 96,
                    borderRadius: 999,
                    padding: "8px 12px",
                    background: efroSummaryColor,
                    color: "#08101f",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {efroSummaryStatus}
                </span>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#cbd5e1" }}>
                ok={String(efroSummary?.ok)} · degraded={String(efroSummary?.degraded)}
              </div>
            </div>

            <div
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, color: "#93c5fd", marginBottom: 8 }}>Letzter Lauf</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc" }}>
                {efroSummary?.last_run_at || "—"}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#cbd5e1" }}>
                Loop={String(efroSummary?.enabled)} · Intervall={efroSummary?.interval_seconds ?? "—"}s
              </div>
            </div>

            <div
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, color: "#93c5fd", marginBottom: 8 }}>Public Health</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc" }}>
                {efroSummary?.public_health_consecutive_failures ?? "—"} / {efroSummary?.public_health_incident_threshold ?? "—"}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#cbd5e1" }}>
                letzte OK-Zeit: {efroSummary?.last_public_health_ok_at || "—"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, fontSize: 13, color: "#cbd5e1" }}>
            {efroAgent.error
              ? `EFRO-Agent-Fehler: ${efroAgent.error}`
              : efroSummary?.control_center_note || "EFRO-Agent-Summary aktiv"}
          </div>
        </section>

        <div className="metrics-grid">
          <div className="card">
            <div className="metric-label">Produkte</div>
            <div className="metric-value">{shop.productCount}</div>
            <div className="small">Duplikat-Kandidaten: {shop.duplicateCandidateCount}</div>
          </div>
          <div className="card">
            <div className="metric-label">Response Cache</div>
            <div className="metric-value">{shop.responseCacheEntryCount}</div>
            <div className="small">Shop-bezogene Antwort-Cache-Einträge</div>
          </div>
          <div className="card">
            <div className="metric-label">Commerce</div>
            <div className="metric-value">{shop.commerceLastStatus}</div>
            <div className="small">{shop.commerceLastActionType}</div>
          </div>
          <div className="card">
            <div className="metric-label">Letzter Chat</div>
            <div className="metric-value">{shop.lastChatAt}</div>
            <div className="small">Operator-relevante Aktivität</div>
          </div>
        </div>

        <div className="layout-grid">
          <div className="card">
            <h2 className="section-title">Shop-Kernzustand</h2>
            <div className="kpi-row"><span>Plan</span><strong>{shop.plan}</strong></div>
            <div className="kpi-row"><span>Installiert am</span><strong>{shop.installedAt}</strong></div>
            <div className="kpi-row"><span>Letzter Sync</span><strong>{shop.lastSyncAt}</strong></div>
            <div className="kpi-row"><span>Letzter Chat</span><strong>{shop.lastChatAt}</strong></div>
            <div className="kpi-row"><span>Letzte Commerce-Aktion</span><strong>{shop.commerceLastActionType}</strong></div>
            <div className="kpi-row"><span>Letzter Fehler</span><strong>{shop.lastError || "—"}</strong></div>
            <div className="kpi-row"><span>Nächste Aktion</span><strong>{shop.nextAction}</strong></div>
          </div>

          <div className="card">
            <h2 className="section-title">Alerts & globale Cache-Wahrheit</h2>
            <div className="stack">
              {alerts.length === 0 ? (
                <div className="small">Keine offenen Alerts.</div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="alert-item">
                    <p className="alert-title">{alert.title}</p>
                    <p className="alert-text">{alert.detail}</p>
                  </div>
                ))
              )}
              <div className="alert-item">
                <p className="alert-title">Globaler Audio-Cache</p>
                <p className="alert-text">
                  Einträge: {globalAudioCacheEntryCount} · Hits gesamt: {globalAudioCacheHitCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
