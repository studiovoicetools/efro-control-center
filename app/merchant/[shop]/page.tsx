import Link from "next/link";
import { getShopConfigSnapshot } from "@/lib/efro-shop-config";
import MerchantSettingsForm from "@/components/merchant-settings-form";

export const dynamic = "force-dynamic";

type MerchantPageProps = {
  params: {
    shop: string;
  };
};

function card(title: string, value: string | number, subtitle?: string) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{value}</div>
      {subtitle ? <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>{subtitle}</div> : null}
    </div>
  );
}

function statusBadge(text: string, good?: boolean) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 700,
        background: good ? "#dcfce7" : "#fee2e2",
        color: good ? "#166534" : "#991b1b",
      }}
    >
      {text}
    </span>
  );
}

export default async function MerchantPage({ params }: MerchantPageProps) {
  const shopDomain = decodeURIComponent(params.shop || "").trim();
  const data = await getShopConfigSnapshot(shopDomain);

  const settings = data.settings;
  const avatar = data.selectedAvatar;
  const voice = data.selectedVoice;
  const overview = data.shopOverview || {};
  const alerts = Array.isArray(data.shopAlerts) ? data.shopAlerts : [];

  const conversations24h = Number(overview.brainRequestCount24h || 0);
  const commerce24h = Number(overview.commerceActionCount || 0);
  const productCount = Number(overview.productCount || 0);
  const onboardingDone = Boolean(settings.onboardingCompleted);
  const efroActive = productCount > 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
            <div style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", letterSpacing: 0.3 }}>
              EFRO Dashboard
            </div>
            <h1 style={{ margin: "8px 0 0", fontSize: 34, lineHeight: 1.1 }}>
              Dein EFRO-Arbeitsstand für {shopDomain}
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "#475569", maxWidth: 760 }}>
              Hier sieht der Betreiber nur die Dinge, die für ihn wichtig sind:
              Avatar, Stimme, Sprache, Aktivität und wie EFRO aktuell im Zielkontext arbeitet.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderRadius: 16,
              padding: 16,
              minWidth: 260,
              boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b" }}>Status</div>
            <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {statusBadge(efroActive ? "EFRO aktiv" : "Setup nötig", efroActive)}
              {statusBadge(onboardingDone ? "Onboarding fertig" : "Onboarding offen", onboardingDone)}
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: "#475569" }}>
              Letzte Aktivität: {overview.lastChatAt || "—"}
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
          {card("Gespräche 24h", conversations24h, "Wie oft EFRO heute aktiv genutzt wurde")}
          {card("Commerce-Aktionen", commerce24h, "Verkaufsnahe Aktionen / Checkout-nahe Schritte")}
          {card("Inhalte im Ziel", productCount, "Aktuelle Inhaltsbasis für Empfehlungen")}
          {card("Warnungen", alerts.length, "Nur kundenrelevante Hinweise")}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <section
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Deine EFRO-Konfiguration</div>

            <div style={{ display: "grid", gap: 14 }}>
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  background: "#f8fafc",
                }}
              >
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Avatar</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{avatar?.label || "Nicht gewählt"}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>
                  {avatar?.description || "Wähle den Avatar, der am besten zu deiner Marke passt."}
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  background: "#f8fafc",
                }}
              >
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Stimme</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{voice?.label || "Nicht gewählt"}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>
                  {voice?.description || "Wähle eine Stimme, die zur Marke und zum Verkaufsstil passt."}
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  background: "#f8fafc",
                }}
              >
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Sprache</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{settings.selectedLanguage || "de"}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>
                  Aktuell passend für deinen Demo-/Zielstand ausgewählt.
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  background: "#f8fafc",
                  fontSize: 14,
                  color: "#334155",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Empfohlene nächste Aktion</div>
                <div>{overview.nextAction || "EFRO weiter beobachten und testen."}</div>
              </div>
            </div>
          </section>

          <MerchantSettingsForm
            shopDomain={shopDomain}
            selectedAvatarId={settings.selectedAvatarId}
            selectedVoiceId={settings.selectedVoiceId}
            selectedLanguage={settings.selectedLanguage}
            onboardingCompleted={settings.onboardingCompleted}
            availableAvatars={data.availableAvatars}
            availableVoices={data.availableVoices}
          />
        </div>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
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
            <div style={{ fontSize: 20, fontWeight: 800 }}>Hinweise für dich</div>
            <Link
              href={`/onboarding/${encodeURIComponent(shopDomain)}`}
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Zum Onboarding
            </Link>
          </div>

          {alerts.length === 0 ? (
            <div style={{ color: "#475569", fontSize: 14 }}>Aktuell keine wichtigen Hinweise für dich.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {alerts.slice(0, 4).map((alert, idx) => (
                <li key={`${alert.id || "alert"}-${idx}`} style={{ marginBottom: 8, color: "#334155" }}>
                  <strong>{alert.title || "Hinweis"}:</strong> {alert.detail || ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
