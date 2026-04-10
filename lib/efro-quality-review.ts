import { getShopConfigSnapshot } from "@/lib/efro-shop-config";
import { getGoLiveVerdict } from "@/lib/efro-product-model";

type AlertLike = {
  id?: string;
  title?: string;
  detail?: string;
  severity?: string;
};

type QualityItem = {
  title: string;
  detail: string;
  level: "good" | "warn" | "critical";
};

function levelFromSeverity(severity?: string): "good" | "warn" | "critical" {
  if (severity === "error" || severity === "critical") return "critical";
  if (severity === "warn") return "warn";
  return "good";
}

export async function getQualityReviewSnapshot(shopDomain: string) {
  const config = await getShopConfigSnapshot(shopDomain);
  const overview = (config.shopOverview || {}) as Record<string, unknown>;
  const alerts = (Array.isArray(config.shopAlerts) ? config.shopAlerts : []) as AlertLike[];

  const productCount = Number(overview.productCount || 0);
  const brainRequestCount24h = Number(overview.brainRequestCount24h || 0);
  const brainCacheHitCount24h = Number(overview.brainCacheHitCount24h || 0);
  const commerceActionCount = Number(overview.commerceActionCount || 0);
  const duplicateCandidateCount = Number(overview.duplicateCandidateCount || 0);
  const healthScoreRaw = Number(overview.healthScore || 0);
  const commerceLastStatus = String(overview.commerceLastStatus || "—");
  const nextAction = String(overview.nextAction || "EFRO weiter beobachten.");
  const lastError = String(overview.lastError || "");
  const lastSyncAt = String(overview.lastSyncAt || "—");
  const lastChatAt = String(overview.lastChatAt || "—");

  let readinessScore = healthScoreRaw;
  if (productCount > 0) readinessScore = Math.max(readinessScore, 55);
  if (brainRequestCount24h > 0) readinessScore = Math.max(readinessScore, 65);
  if (commerceActionCount > 0) readinessScore = Math.max(readinessScore, 70);
  if (productCount === 0) readinessScore = Math.min(readinessScore, 35);
  if (commerceLastStatus === "error") readinessScore = Math.min(readinessScore, 59);
  readinessScore = Math.max(0, Math.min(100, readinessScore));

  const verdict = getGoLiveVerdict(readinessScore);

  const strengths: QualityItem[] = [];
  const weaknesses: QualityItem[] = [];
  const productGroupSignals: QualityItem[] = [];
  const trainingSignals: QualityItem[] = [];

  if (productCount > 0) {
    strengths.push({
      title: "Inhaltsbasis vorhanden",
      detail: `${productCount} Inhalte oder Angebote stehen EFRO aktuell für Empfehlungen zur Verfügung.`,
      level: "good",
    });
  } else {
    weaknesses.push({
      title: "Keine verwertbare Inhaltsbasis",
      detail: "EFRO kann ohne verwertbare Inhalts- oder Angebotsbasis keine starken Empfehlungen liefern.",
      level: "critical",
    });
  }

  if (brainRequestCount24h > 0) {
    strengths.push({
      title: "EFRO wird aktiv genutzt",
      detail: `${brainRequestCount24h} Gespräche in den letzten 24h zeigen echte Nutzung im Zielkontext.`,
      level: "good",
    });
  } else {
    weaknesses.push({
      title: "Noch keine echte Nutzung",
      detail: "Ohne aktuelle Gespräche lässt sich die Antwortqualität nur eingeschränkt bewerten.",
      level: "warn",
    });
  }

  if (commerceActionCount > 0 && commerceLastStatus !== "error") {
    strengths.push({
      title: "Commerce-Signale vorhanden",
      detail: `${commerceActionCount} commerce-nahe Aktionen zeigen, dass EFRO verkaufsrelevant arbeitet.`,
      level: "good",
    });
  }

  if (commerceLastStatus === "error") {
    weaknesses.push({
      title: "Commerce-Flow instabil",
      detail: "Die letzte Commerce-Aktion ist fehlgeschlagen und sollte vor Go-Live geprüft werden.",
      level: "critical",
    });
  }

  if (duplicateCandidateCount > 0) {
    weaknesses.push({
      title: "Inhaltsqualität angreifbar",
      detail: `${duplicateCandidateCount} doppelte Inhaltstitel oder Angebotsbezeichnungen können die Empfehlungsqualität schwächen.`,
      level: "warn",
    });
  }

  if (brainRequestCount24h > 0 && brainCacheHitCount24h === 0) {
    weaknesses.push({
      title: "Antwortmuster noch nicht effizient",
      detail: "Aktive Nutzung ohne Cache-Hits deutet oft auf Query-/Intent-Streuung hin.",
      level: "warn",
    });
  }

  if (lastError && lastError !== "—") {
    weaknesses.push({
      title: "Offener Qualitäts- oder Sync-Hinweis",
      detail: lastError,
      level: "warn",
    });
  }

  productGroupSignals.push({
    title: "Bereichs-Analyse folgt als nächster Ausbau",
    detail:
      "Sobald themen- oder bereichsbezogene Ereignisse persistiert werden, zeigen wir hier stark/schwach pro Bereich.",
    level: "warn",
  });

  trainingSignals.push({
    title: "Begriffe mit Trainingsbedarf folgen als nächster Ausbau",
    detail:
      "Die Qualitätszentrale ist vorbereitet; als nächstes binden wir unbekannte Begriffe und No-Result-Muster an.",
    level: "warn",
  });

  const alertSignals: QualityItem[] = alerts.slice(0, 6).map((alert) => ({
    title: alert.title || "Hinweis",
    detail: alert.detail || "",
    level: levelFromSeverity(alert.severity),
  }));

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    shopDomain,
    verdict,
    readinessScore,
    nextAction,
    links: {
      merchant: `/merchant/${encodeURIComponent(shopDomain)}`,
      handoff: `/api/ops/handoff?shop=${encodeURIComponent(shopDomain)}`,
      evidence: `/api/ops/evidence/${encodeURIComponent(shopDomain)}`,
      config: `/api/ops/shop-config/${encodeURIComponent(shopDomain)}`,
    },
    currentState: {
      status: String(overview.status || "unknown"),
      healthScore: healthScoreRaw,
      priorityScore: Number(overview.priorityScore || 0),
      productCount,
      brainRequestCount24h,
      brainCacheHitCount24h,
      commerceActionCount,
      commerceLastStatus,
      duplicateCandidateCount,
      lastSyncAt,
      lastChatAt,
    },
    strengths,
    weaknesses,
    productGroupSignals,
    trainingSignals,
    alertSignals,
    snapshotSource: config.source,
    settingsSource: config.settingsSource,
  };
}
