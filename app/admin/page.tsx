import Link from "next/link";
import { getOverviewData } from "@/lib/ops-data";

export const dynamic = "force-dynamic";

type FreezeInfoItem = {
  repo?: string;
  tag?: string;
  commit?: string;
  parallelBranch?: string;
};

type AlertItemLike = {
  id?: string;
  shopDomain?: string;
  severity?: string;
  title?: string;
  detail?: string;
};

type ShopLike = {
  shopDomain?: string;
  plan?: string;
  status?: string;
  installedAt?: string;
  lastSeenAt?: string;
  lastSyncAt?: string;
  lastChatAt?: string;
  lastError?: string | null;
  productCount?: number;
  duplicateCandidateCount?: number;
  responseCacheEntryCount?: number;
  brainRequestCount24h?: number;
  brainCacheHitCount24h?: number;
  audioCacheEntryCount?: number;
  audioCacheHitCount?: number;
  commerceActionCount?: number;
  commerceLastStatus?: string;
  commerceLastActionType?: string;
  estimatedCost24h?: number;
  healthScore?: number;
  priorityScore?: number;
  nextAction?: string;
};

type OverviewData = {
  ok?: boolean;
  source?: string;
  summary?: {
    totalShops?: number;
    redShops?: number;
    yellowShops?: number;
    totalCost24h?: number;
    avgBrainCacheHitRate?: number;
    globalAudioCacheEntryCount?: number;
    globalAudioCacheHitCount?: number;
  };
  freezeInfo?: FreezeInfoItem[];
  alerts?: AlertItemLike[];
  shops?: ShopLike[];
};

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

function box(title: string, value: string | number, subtitle?: string) {
  return (
    <div
      style={{
        background: "#11162a",
        border: "1px solid #253056",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ fontSize: 12, color: "#9fb0e0", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#ffffff" }}>{value}</div>
      {subtitle ? (
        <div style={{ marginTop: 8, fontSize: 13, color: "#bfcaf0" }}>{subtitle}</div>
      ) : null}
    </div>
  );
}

function statusColor(status?: string) {
  if (status === "gruen") return "#1db954";
  if (status === "gelb") return "#f4b400";
  return "#ff5a67";
}

function severityColor(severity?: string) {
  if (severity === "error") return "#ff5a67";
  if (severity === "warn") return "#f4b400";
  return "#7aa2ff";
}

function shopLink(shopDomain?: string, hrefBase?: string, label?: string) {
  const domain = shopDomain || "";
  if (!domain || !hrefBase || !label) return null;
  const href = hrefBase.includes("?shop=")
    ? `${hrefBase}${encodeURIComponent(domain)}`
    : `${hrefBase}/${encodeURIComponent(domain)}`;

  return (
    <Link
      href={href}
      style={{
        color: "#8cb3ff",
        textDecoration: "none",
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {label}
    </Link>
  );
}

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

export default async function AdminPage() {
  const data = (await getOverviewData()) as OverviewData;
  const summary = data?.summary || {};
  const shops = Array.isArray(data?.shops) ? data.shops : [];
  const alerts = Array.isArray(data?.alerts) ? data.alerts : [];
  const freezeInfo = Array.isArray(data?.freezeInfo) ? data.freezeInfo : [];
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

  const criticalShops = [...shops]
    .sort((a, b) => Number(b.priorityScore || 0) - Number(a.priorityScore || 0))
    .slice(0, 5);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0f1f 0%, #0f1730 100%)",
        color: "#edf2ff",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.1 }}>EFRO Admin</h1>
            <p style={{ margin: "10px 0 0", color: "#b7c3ea", fontSize: 15 }}>
              Operator-Ansicht für Shops, Watchdog, Qualität, Merchant-Dashboard und Freeze-Status.
            </p>
          </div>

          <div
            style={{
              background: "#121a33",
              border: "1px solid #2d3b6d",
              borderRadius: 14,
              padding: "12px 14px",
              minWidth: 260,
            }}
          >
            <div style={{ fontSize: 12, color: "#9fb0e0" }}>Quelle</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{data?.source || "unknown"}</div>
            <div style={{ fontSize: 12, color: "#b7c3ea", marginTop: 6 }}>
              Interner Bereich. Freeze/Main bleibt unberührt.
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
          {box("Gesamt Shops", Number(summary.totalShops || 0), "Aktive Operator-Sicht")}
          {box("Rote Shops", Number(summary.redShops || 0), "Kritische Priorität")}
          {box("Gelbe Shops", Number(summary.yellowShops || 0), "Beobachten")}
          {box(
            "Ø Brain-Cache-Hit-Rate",
            `${Math.round(Number(summary.avgBrainCacheHitRate || 0) * 100)}%`,
            "Über alle Shops mit Requests"
          )}
          {box(
            "Global Audio Cache",
            Number(summary.globalAudioCacheEntryCount || 0),
            `Hits: ${Number(summary.globalAudioCacheHitCount || 0)}`
          )}
          {box(
            "Kosten 24h",
            Number(summary.totalCost24h || 0),
            "Nur intern relevant"
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <section
            style={{
              background: "#11162a",
              border: "1px solid #253056",
              borderRadius: 16,
              padding: 18,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Top kritische Shops</div>
            <div style={{ display: "grid", gap: 12 }}>
              {criticalShops.length === 0 ? (
                <div style={{ color: "#b7c3ea" }}>Keine kritischen Shops vorhanden.</div>
              ) : (
                criticalShops.map((shop) => (
                  <div
                    key={shop.shopDomain}
                    style={{
                      background: "#0d1326",
                      border: "1px solid #202b52",
                      borderRadius: 14,
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{shop.shopDomain}</div>
                        <div style={{ marginTop: 6, color: "#b7c3ea", fontSize: 13 }}>
                          {shop.nextAction || "Beobachten"}
                        </div>
                        <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
                          {shopLink(shop.shopDomain, "/merchant", "Merchant")}
                          {shopLink(shop.shopDomain, "/internal/quality", "Quality")}
                          {shopLink(shop.shopDomain, "/api/ops/handoff?shop=", "Handoff")}
                          {shopLink(shop.shopDomain, "/api/ops/evidence", "Evidence")}
                          {shopLink(shop.shopDomain, "/api/ops/shop-config", "Config")}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 150 }}>
                        <div style={{ fontSize: 13, color: "#9fb0e0" }}>
                          Health {Number(shop.healthScore || 0)} / Priority {Number(shop.priorityScore || 0)}
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Link
                            href={`/shops/${encodeURIComponent(shop.shopDomain || "")}`}
                            style={{ color: "#8cb3ff", textDecoration: "none", fontWeight: 700 }}
                          >
                            Shop-Detail öffnen
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section
            style={{
              background: "#11162a",
              border: "1px solid #253056",
              borderRadius: 16,
              padding: 18,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Aktuelle Alerts</div>
            <div style={{ display: "grid", gap: 10 }}>
              {alerts.length === 0 ? (
                <div style={{ color: "#b7c3ea" }}>Keine Alerts vorhanden.</div>
              ) : (
                alerts.slice(0, 8).map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      background: "#0d1326",
                      border: `1px solid ${severityColor(alert.severity)}`,
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{alert.title || "Alert"}</div>
                    <div style={{ color: "#c7d3f5", fontSize: 13, marginTop: 4 }}>
                      {alert.shopDomain || "unknown"}
                    </div>
                    <div style={{ color: "#aebce8", fontSize: 13, marginTop: 6 }}>
                      {alert.detail || ""}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>


        <section
          style={{
            background: "#11162a",
            border: "1px solid #253056",
            borderRadius: 16,
            padding: 18,
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
            <div style={{ fontSize: 18, fontWeight: 700 }}>EFRO Agent Live-Status</div>
            <Link href="/api/ops/watchdog" style={{ color: "#8cb3ff", textDecoration: "none" }}>
              /api/ops/watchdog
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#0d1326",
                border: "1px solid #202b52",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, color: "#9fb0e0", marginBottom: 8 }}>Verbindung</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#ffffff" }}>
                {efroAgent.connected ? "verbunden" : "nicht verbunden"}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#bfcaf0" }}>{efroAgent.source}</div>
            </div>

            <div
              style={{
                background: "#0d1326",
                border: "1px solid #202b52",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, color: "#9fb0e0", marginBottom: 8 }}>Summary-Status</div>
              <div>
                <span
                  style={{
                    display: "inline-block",
                    minWidth: 96,
                    textAlign: "center",
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: efroSummaryColor,
                    color: "#08101f",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {efroSummaryStatus}
                </span>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#bfcaf0" }}>
                ok={String(efroSummary?.ok)} / degraded={String(efroSummary?.degraded)}
              </div>
            </div>

            <div
              style={{
                background: "#0d1326",
                border: "1px solid #202b52",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, color: "#9fb0e0", marginBottom: 8 }}>Letzter Lauf</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
                {efroSummary?.last_run_at || "—"}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#bfcaf0" }}>
                Loop={String(efroSummary?.enabled)} / Intervall={efroSummary?.interval_seconds ?? "—"}s
              </div>
            </div>

            <div
              style={{
                background: "#0d1326",
                border: "1px solid #202b52",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, color: "#9fb0e0", marginBottom: 8 }}>Public Health</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#ffffff" }}>
                {efroSummary?.public_health_consecutive_failures ?? "—"} / {efroSummary?.public_health_incident_threshold ?? "—"}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#bfcaf0" }}>
                letzte OK-Zeit: {efroSummary?.last_public_health_ok_at || "—"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, fontSize: 13, color: "#b7c3ea" }}>
            {efroAgent.error
              ? `EFRO-Agent-Fehler: ${efroAgent.error}`
              : efroSummary?.control_center_note || "EFRO-Agent-Summary aktiv"}
          </div>
        </section>

        <section
          style={{
            background: "#11162a",
            border: "1px solid #253056",
            borderRadius: 16,
            padding: 18,
            marginBottom: 24,
            overflowX: "auto",
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
            <div style={{ fontSize: 18, fontWeight: 700 }}>Shop-Übersicht</div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13 }}>
              <Link href="/api/ops/overview" style={{ color: "#8cb3ff", textDecoration: "none" }}>
                /api/ops/overview
              </Link>
              <Link href="/api/ops/watchdog" style={{ color: "#8cb3ff", textDecoration: "none" }}>
                /api/ops/watchdog
              </Link>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1360 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#9fb0e0", fontSize: 12 }}>
                <th style={{ padding: "10px 8px" }}>Shop</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
                <th style={{ padding: "10px 8px" }}>Produkte</th>
                <th style={{ padding: "10px 8px" }}>Response Cache</th>
                <th style={{ padding: "10px 8px" }}>Brain Req 24h</th>
                <th style={{ padding: "10px 8px" }}>Brain Cache Hits</th>
                <th style={{ padding: "10px 8px" }}>Audio Cache</th>
                <th style={{ padding: "10px 8px" }}>Commerce</th>
                <th style={{ padding: "10px 8px" }}>Kosten 24h</th>
                <th style={{ padding: "10px 8px" }}>Direkte Links</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.shopDomain} style={{ borderTop: "1px solid #202b52" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 700 }}>
                    <div>{shop.shopDomain}</div>
                    <div style={{ color: "#9fb0e0", fontSize: 12, marginTop: 4 }}>
                      {shop.plan || "—"}
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        minWidth: 72,
                        textAlign: "center",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: statusColor(shop.status),
                        color: "#08101f",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {shop.status || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px" }}>{Number(shop.productCount || 0)}</td>
                  <td style={{ padding: "12px 8px" }}>{Number(shop.responseCacheEntryCount || 0)}</td>
                  <td style={{ padding: "12px 8px" }}>{Number(shop.brainRequestCount24h || 0)}</td>
                  <td style={{ padding: "12px 8px" }}>{Number(shop.brainCacheHitCount24h || 0)}</td>
                  <td style={{ padding: "12px 8px" }}>
                    {Number(shop.audioCacheEntryCount || 0)} / {Number(shop.audioCacheHitCount || 0)}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    {Number(shop.commerceActionCount || 0)} / {shop.commerceLastStatus || "—"}
                  </td>
                  <td style={{ padding: "12px 8px" }}>{Number(shop.estimatedCost24h || 0)}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {shopLink(shop.shopDomain, "/merchant", "Merchant")}
                      {shopLink(shop.shopDomain, "/internal/quality", "Quality")}
                      {shopLink(shop.shopDomain, "/api/ops/handoff?shop=", "Handoff")}
                      {shopLink(shop.shopDomain, "/api/ops/evidence", "Evidence")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section
          style={{
            background: "#11162a",
            border: "1px solid #253056",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Freeze-Referenzen</div>
          <div style={{ display: "grid", gap: 10 }}>
            {freezeInfo.length === 0 ? (
              <div style={{ color: "#b7c3ea" }}>Keine Freeze-Infos vorhanden.</div>
            ) : (
              freezeInfo.map((item) => (
                <div
                  key={`${item.repo}-${item.commit}`}
                  style={{
                    background: "#0d1326",
                    border: "1px solid #202b52",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{item.repo || "unknown"}</div>
                  <div style={{ marginTop: 6, color: "#b7c3ea", fontSize: 13 }}>
                    Tag: {item.tag || "—"}
                  </div>
                  <div style={{ marginTop: 4, color: "#b7c3ea", fontSize: 13 }}>
                    Commit: {item.commit || "—"}
                  </div>
                  <div style={{ marginTop: 4, color: "#b7c3ea", fontSize: 13 }}>
                    Parallel Branch: {item.parallelBranch || "—"}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
