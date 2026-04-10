import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { StatusPill } from "@/components/status-pill";
import { getOverviewData } from "@/lib/ops-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getOverviewData();
  const { summary, freezeInfo, alerts, shops, source } = data;

  return (
    <main>
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">EFRO Control Center</h1>
            <p className="page-subtitle">
              Phase 1 MVP für Sichtbarkeit, Fehlerkontrolle, Kostenüberwachung und
              Priorisierung aller installierten EFRO-Shops.
            </p>
            <p className="small" style={{ marginTop: 10 }}>
              Datenquelle: <strong>{source === "supabase" ? "Supabase live" : "Mock-Fallback"}</strong>
            </p>
          </div>

          <div className="freeze-box">
            <div className="section-title">Submission-Freeze</div>
            <div className="stack">
              {freezeInfo.map((item) => (
                <div key={item.repo}>
                  <div><strong>{item.repo}</strong></div>
                  <div className="small">{item.tag}</div>
                  <div className="code">{item.commit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="metrics-grid">
          <MetricCard
            label="Shops gesamt"
            value={String(summary.totalShops)}
            hint="Alle aktuell überwachten Shops"
          />
          <MetricCard
            label="Rote Shops"
            value={String(summary.redShops)}
            hint="Sofortige Aufmerksamkeit erforderlich"
          />
          <MetricCard
            label="Gelbe Shops"
            value={String(summary.yellowShops)}
            hint="Beobachten und gezielt stabilisieren"
          />
          <MetricCard
            label="Ø Brain Cache"
            value={`${Math.round(summary.avgBrainCacheHitRate * 100)}%`}
            hint="Erster Kostenhebel für wiederholte Anfragen"
          />
        </div>

        <div className="layout-grid">
          <div className="card table-wrap">
            <h2 className="section-title">Shop-Übersicht nach Priorität</h2>
            <table>
              <thead>
                <tr>
                  <th>Prio</th>
                  <th>Shop</th>
                  <th>Status</th>
                  <th>Produkte</th>
                  <th>Response Cache</th>
                  <th>Commerce</th>
                  <th>Letzter Sync</th>
                  <th>Letzter Chat</th>
                  <th>Nächste Aktion</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((shop) => (
                  <tr key={shop.shopDomain}>
                    <td><strong>{shop.priorityScore}</strong></td>
                    <td>
                      <Link
                        className="shop-link"
                        href={`/shops/${encodeURIComponent(shop.shopDomain)}`}
                      >
                        {shop.shopDomain}
                      </Link>
                      <div className="small">{shop.plan}</div>
                    </td>
                    <td><StatusPill status={shop.status} /></td>
                    <td>
                      {shop.productCount}
                      <div className="small">Duplikate: {shop.duplicateCandidateCount}</div>
                    </td>
                    <td>{shop.responseCacheEntryCount}</td>
                    <td>
                      {shop.commerceLastStatus}
                      <div className="small">{shop.commerceLastActionType}</div>
                    </td>
                    <td>{shop.lastSyncAt}</td>
                    <td>{shop.lastChatAt}</td>
                    <td>{shop.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="stack">
            <div className="card">
              <h2 className="section-title">Priorisierte Alerts</h2>
              <div className="stack">
                {alerts.length === 0 ? (
                  <div className="small">Keine aktiven Alerts.</div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="alert-item">
                      <p className="alert-title">{alert.title}</p>
                      <p className="small">{alert.shopDomain}</p>
                      <p className="alert-text">{alert.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="section-title">Globale Cache-Wahrheit</h2>
              <div className="kpi-row">
                <span>Audio-Cache-Einträge</span>
                <strong>{summary.globalAudioCacheEntryCount}</strong>
              </div>
              <div className="kpi-row">
                <span>Audio-Cache-Hits gesamt</span>
                <strong>{summary.globalAudioCacheHitCount}</strong>
              </div>
              <div className="small" style={{ marginTop: 10 }}>
                Audio-Cache ist aktuell global und noch nicht shop-genau attributierbar.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
