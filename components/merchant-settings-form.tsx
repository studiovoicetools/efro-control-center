"use client";

import { useMemo, useState } from "react";

type CatalogItem = {
  id?: string;
  label?: string;
  description?: string;
};

type MerchantSettingsFormProps = {
  shopDomain: string;
  selectedAvatarId?: string | null;
  selectedVoiceId?: string | null;
  selectedLanguage?: string | null;
  onboardingCompleted?: boolean;
  availableAvatars: CatalogItem[];
  availableVoices: CatalogItem[];
  submitLabel?: string;
  successMessage?: string;
  redirectHref?: string | null;
  showOnboardingLink?: boolean;
};

export default function MerchantSettingsForm({
  shopDomain,
  selectedAvatarId,
  selectedVoiceId,
  selectedLanguage,
  onboardingCompleted,
  availableAvatars,
  availableVoices,
  submitLabel = "Änderungen speichern",
  successMessage = "Einstellungen gespeichert. Die Seite wird mit dem neuen Stand aktualisiert.",
  redirectHref = null,
  showOnboardingLink = true,
}: MerchantSettingsFormProps) {
  const [avatarId, setAvatarId] = useState(selectedAvatarId || "");
  const [voiceId, setVoiceId] = useState(selectedVoiceId || "");
  const [language, setLanguage] = useState(selectedLanguage || "de");
  const [completed, setCompleted] = useState(Boolean(onboardingCompleted));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "idle">("idle");

  const avatarHint = useMemo(
    () => availableAvatars.find((item) => item.id === avatarId)?.description || "",
    [availableAvatars, avatarId]
  );

  const voiceHint = useMemo(
    () => availableVoices.find((item) => item.id === voiceId)?.description || "",
    [availableVoices, voiceId]
  );

  async function handleSave() {
    setIsSaving(true);
    setMessage("");
    setMessageType("idle");

    try {
      const response = await fetch(`/api/ops/shop-config/${encodeURIComponent(shopDomain)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedAvatarId: avatarId || null,
          selectedVoiceId: voiceId || null,
          selectedLanguage: language,
          onboardingCompleted: completed,
          onboardingStep: completed ? "done" : "review",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "settings_save_failed");
      }

      setMessageType("success");
      setMessage(successMessage);
      window.setTimeout(() => {
        if (redirectHref) {
          window.location.href = redirectHref;
          return;
        }
        window.location.reload();
      }, 900);
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? `Speichern fehlgeschlagen: ${error.message}`
          : "Speichern fehlgeschlagen."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Avatar, Stimme & Sprache ändern</div>

      <div style={{ display: "grid", gap: 14 }}>
        <div>
          <label
            htmlFor="merchant-avatar"
            style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#334155" }}
          >
            Avatar
          </label>
          <select
            id="merchant-avatar"
            value={avatarId}
            onChange={(e) => setAvatarId(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              padding: "12px 14px",
              fontSize: 14,
              background: "#ffffff",
              color: "#0f172a",
            }}
          >
            {availableAvatars.map((item) => (
              <option key={item.id || item.label} value={item.id || ""}>
                {item.label || item.id || "Unbekannter Avatar"}
              </option>
            ))}
          </select>
          {avatarHint ? (
            <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>{avatarHint}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="merchant-voice"
            style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#334155" }}
          >
            Stimme
          </label>
          <select
            id="merchant-voice"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              padding: "12px 14px",
              fontSize: 14,
              background: "#ffffff",
              color: "#0f172a",
            }}
          >
            {availableVoices.map((item) => (
              <option key={item.id || item.label} value={item.id || ""}>
                {item.label || item.id || "Unbekannte Stimme"}
              </option>
            ))}
          </select>
          {voiceHint ? (
            <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>{voiceHint}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="merchant-language"
            style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#334155" }}
          >
            Sprache
          </label>
          <select
            id="merchant-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              padding: "12px 14px",
              fontSize: 14,
              background: "#ffffff",
              color: "#0f172a",
            }}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "12px 14px",
            background: "#f8fafc",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <span style={{ fontSize: 14, color: "#334155" }}>Onboarding als abgeschlossen markieren</span>
        </label>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              borderRadius: 14,
              padding: "14px 16px",
              background: isSaving ? "#93c5fd" : "#2563eb",
              color: "#ffffff",
              border: "none",
              fontWeight: 700,
              cursor: isSaving ? "not-allowed" : "pointer",
              minWidth: 170,
            }}
          >
            {isSaving ? "Speichert…" : submitLabel}
          </button>

          {showOnboardingLink ? (
            <a
              href={`/onboarding/${encodeURIComponent(shopDomain)}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                padding: "14px 16px",
                background: "#ffffff",
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 700,
                border: "1px solid #bfdbfe",
              }}
            >
              Zum Onboarding
            </a>
          ) : null}
        </div>

        {message ? (
          <div
            style={{
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 14,
              background: messageType === "success" ? "#dcfce7" : "#fee2e2",
              color: messageType === "success" ? "#166534" : "#991b1b",
              border: messageType === "success" ? "1px solid #86efac" : "1px solid #fca5a5",
            }}
          >
            {message}
          </div>
        ) : null}
      </div>
    </section>
  );
}
