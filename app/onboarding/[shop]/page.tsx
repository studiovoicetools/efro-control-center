import Link from "next/link";
import { getShopConfigSnapshot } from "@/lib/efro-shop-config";
import MerchantSettingsForm from "@/components/merchant-settings-form";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    shop: string;
  };
};

function stepCard(step: string, title: string, detail: string, active?: boolean) {
  return (
    <div
      style={{
        border: active ? "1px solid #60a5fa" : "1px solid #e2e8f0",
        background: active ? "#eff6ff" : "#ffffff",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 8px 20px rgba(15,23,42,0.05)",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, color: active ? "#2563eb" : "#64748b", marginBottom: 8 }}>
        SCHRITT {step}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: "#475569" }}>{detail}</div>
    </div>
  );
}

function badge(text: string, good?: boolean) {
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

export default async function OnboardingPage({ params }: PageProps) {
  const shopDomain = decodeURIComponent(params.shop || "").trim();
  const data = await getShopConfigSnapshot(shopDomain);

  const settings = data.settings;
  const avatar = data.selectedAvatar;
  const voice = data.selectedVoice;
  const overview = data.shopOverview || {};
  const alerts = Array.isArray(data.shopAlerts) ? data.shopAlerts : [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #dbeafe 0%, #eff6ff 35%, #ffffff 100%)",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
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
            <div style={{ fontSize: 13, fontWeight: 800, color: "#2563eb", letterSpacing: 0.3 }}>
              EFRO Onboarding
            </div>
            <h1 style={{ margin: "8px 0 0", fontSize: 38, lineHeight: 1.05 }}>
              Richte deinen KI-Verkäufer für {shopDomain} ein
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: 16, color: "#475569", maxWidth: 820 }}>
              Wähle den passenden Avatar, die richtige Stimme und die Sprache für deinen Shop.
              Später kannst du alles jederzeit wieder im Merchant-Dashboard ändern.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderRadius: 18,
              padding: 16,
              minWidth: 270,
              boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b" }}>Aktueller Stand</div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {badge(settings.onboardingCompleted ? "Onboarding fertig" : "Onboarding offen", settings.onboardingCompleted)}
              {badge(Number(overview.productCount || 0) > 0 ? "Shop verbunden" : "Shop prüfen", Number(overview.productCount || 0) > 0)}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: "#475569" }}>
              Aktueller Avatar: {avatar?.label || "Nicht gewählt"}
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>
              Aktuelle Stimme: {voice?.label || "Nicht gewählt"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {stepCard("1", "Avatar wählen", "Wähle den Charakter, der am besten zu deiner Marke passt.", true)}
          {stepCard("2", "Stimme wählen", "Gib EFRO eine Stimme, die seriös, freundlich oder verkaufsstark wirkt.", true)}
          {stepCard("3", "Sprache festlegen", "Stelle sicher, dass EFRO zur tatsächlichen Shop-Sprache passt.", true)}
          {stepCard("4", "Speichern & starten", "Mit einem Klick speicherst du alles für deinen Shop.", true)}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <MerchantSettingsForm
            shopDomain={shopDomain}
            selectedAvatarId={settings.selectedAvatarId}
            selectedVoiceId={settings.selectedVoiceId}
            selectedLanguage={settings.selectedLanguage}
            onboardingCompleted={settings.onboardingCompleted}
            availableAvatars={data.availableAvatars}
            availableVoices={data.availableVoices}
            submitLabel="Onboarding speichern"
            successMessage="Onboarding gespeichert. Du wirst gleich zum Merchant-Dashboard weitergeleitet."
            redirectHref={`/merchant/${encodeURIComponent(shopDomain)}`}
            showOnboardingLink={false}
          />

          <section
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Dein aktuelles Setup</div>

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
                  {avatar?.description || "Noch kein Avatar ausgewählt."}
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
                  {voice?.description || "Noch keine Stimme ausgewählt."}
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
                  Diese Auswahl sollte zur echten Shop- und Produktsprache passen.
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
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Wichtige Hinweise</div>
                {alerts.length === 0 ? (
                  <div>Aktuell keine direkten Hinweise.</div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {alerts.slice(0, 4).map((alert, idx) => (
                      <li key={`${alert.id || "alert"}-${idx}`} style={{ marginBottom: 6 }}>
                        <strong>{alert.title || "Hinweis"}:</strong> {alert.detail || ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <Link
                href={`/merchant/${encodeURIComponent(shopDomain)}`}
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Zum Merchant-Dashboard
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
