import { NextResponse } from "next/server";
import { getOverviewData } from "@/lib/ops-data";

type FreezeInfoItem = {
  repo?: string;
  tag?: string;
  commit?: string;
  parallelBranch?: string;
};

type AlertLike = {
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
  summary?: Record<string, unknown>;
  freezeInfo?: FreezeInfoItem[];
  alerts?: AlertLike[];
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
      headers: { Accept: "application/json" },
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

function num(value: unknown): number {
  return Number(value || 0);
}

function parseTs(value?: string | null): number {
  if (!value || value === "—") return 0;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
}

function byPriority(a: ShopLike, b: ShopLike) {
  return num(b.priorityScore) - num(a.priorityScore);
}

function buildPrimaryFocus(shop?: ShopLike): string {
  if (!shop?.shopDomain) return "global_target_review";

  if (num(shop.productCount) === 0) return "content_or_inventory_missing";
  if (shop.commerceLastStatus === "error") return "commerce_failure";
  if (typeof shop.lastError === "string" && shop.lastError.trim()) return "sync_or_content_staleness";
  if (num(shop.brainRequestCount24h) > 0 && num(shop.brainCacheHitCount24h) === 0) {
    return "brain_quality_or_query_normalization";
  }
  if (num(shop.duplicateCandidateCount) > 0) return "content_quality_duplicates";
  return "general_target_quality_review";
}

function summarizeShop(shop: ShopLike) {
  return {
    shopDomain: shop.shopDomain || "unknown",
    plan: shop.plan || "unknown",
    status: shop.status || "unknown",
    installedAt: shop.installedAt || "—",
    lastSeenAt: shop.lastSeenAt || "—",
    lastSyncAt: shop.lastSyncAt || "—",
    lastChatAt: shop.lastChatAt || "—",
    lastError: shop.lastError || null,
    productCount: num(shop.productCount),
    duplicateCandidateCount: num(shop.duplicateCandidateCount),
    responseCacheEntryCount: num(shop.responseCacheEntryCount),
    brainRequestCount24h: num(shop.brainRequestCount24h),
    brainCacheHitCount24h: num(shop.brainCacheHitCount24h),
    audioCacheEntryCount: num(shop.audioCacheEntryCount),
    audioCacheHitCount: num(shop.audioCacheHitCount),
    commerceActionCount: num(shop.commerceActionCount),
    commerceLastStatus: shop.commerceLastStatus || "—",
    commerceLastActionType: shop.commerceLastActionType || "—",
    estimatedCost24h: num(shop.estimatedCost24h),
    healthScore: num(shop.healthScore),
    priorityScore: num(shop.priorityScore),
    nextAction: shop.nextAction || "Beobachten",
  };
}

function buildAttackNow(shop?: ShopLike, alerts: AlertLike[] = []): string[] {
  const items: string[] = [];

  if (!shop?.shopDomain) {
    items.push("overview_pruefen");
    items.push("watchdog_alerts_pruefen");
    return items;
  }

  if (num(shop.productCount) === 0) items.push("inhaltsbasis_sync_installation_pruefen");
  if (typeof shop.lastError === "string" && shop.lastError.trim()) items.push("sync_webhooks_inhaltsqualitaet_pruefen");
  if (shop.commerceLastStatus === "error") items.push("commerce_draft_order_flow_pruefen");
  if (num(shop.duplicateCandidateCount) > 0) items.push("doppelte_inhaltstitel_bereinigen");
  if (num(shop.brainRequestCount24h) > 0 && num(shop.brainCacheHitCount24h) === 0) {
    items.push("brain_intent_aliase_query_normalisierung_pruefen");
  }

  const stale = alerts.some((a) => a.shopDomain === shop.shopDomain && String(a.id || "").startsWith("stale-sync-"));
  if (stale) items.push("stale_sync_sofort_pruefen");

  if (items.length === 0) items.push("kein_sofortiger_eingriff_noetig");
  return Array.from(new Set(items));
}

function buildMonitor(shop?: ShopLike): string[] {
  const items: string[] = [];

  if (!shop?.shopDomain) {
    items.push("rote_shops");
    items.push("commerce_errors");
    items.push("inhaltsqualitaet");
    return items;
  }

  items.push("letzte_aktivitaet");
  items.push("brain_requests_24h");
  items.push("commerce_status");

  if (num(shop.responseCacheEntryCount) > 0) items.push("response_cache_nutzung");
  if (num(shop.audioCacheEntryCount) > 0) items.push("audio_cache_global");
  if (num(shop.productCount) > 0) items.push("inhaltsfit_bereiche");
  if (num(shop.duplicateCandidateCount) > 0) items.push("duplikate_inhaltstitel");

  return Array.from(new Set(items));
}

function buildDebugPrompt(
  shop: ReturnType<typeof summarizeShop> | null,
  focus: string,
  attackNow: string[],
  efroAgent?: EfroAgentState
) {
  const liveSummary = efroAgent?.summary;
  const liveStatus = liveSummary?.summary_status || "unknown";

  if (!shop) {
    return [
      "efro debug handoff:",
      "globaler triage-start.",
      `live summary status: ${liveStatus}.`,
      `live connected=${String(efroAgent?.connected)} degraded=${String(liveSummary?.degraded)}.`,
      `primary focus: ${focus}`,
      `attack now: ${attackNow.join(", ")}`,
      "zuerst /api/ops/watchdog lesen, danach /api/ops/overview und auffällige Ziele prüfen.",
    ].join(" ");
  }

  return [
    "efro debug handoff:",
    `betroffenes ziel: ${shop.shopDomain}.`,
    `live summary status: ${liveStatus}.`,
    `live connected=${String(efroAgent?.connected)} degraded=${String(liveSummary?.degraded)} enabled=${String(liveSummary?.enabled)}.`,
    `primary focus: ${focus}.`,
    `status=${shop.status}, health=${shop.healthScore}, priority=${shop.priorityScore}.`,
    `contentOrInventoryCount=${shop.productCount}, brainRequestCount24h=${shop.brainRequestCount24h}, brainCacheHitCount24h=${shop.brainCacheHitCount24h}, commerceLastStatus=${shop.commerceLastStatus}.`,
    `lastSyncAt=${shop.lastSyncAt}, lastChatAt=${shop.lastChatAt}.`,
    `attack now: ${attackNow.join(", ")}.`,
    `naechste aktion: ${shop.nextAction}.`,
  ].join(" ");
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const targetShop = (url.searchParams.get("shop") || "").trim();

    const data = (await getOverviewData()) as OverviewData;
    const shops = (Array.isArray(data?.shops) ? data.shops : []).slice().sort(byPriority);
    const alerts = Array.isArray(data?.alerts) ? data.alerts : [];
    const freezeInfo = Array.isArray(data?.freezeInfo) ? data.freezeInfo : [];
    const efroAgent = await fetchEfroAgentSummary();
    const efroSummary = efroAgent.summary;

    const selectedShop =
      shops.find((shop) => shop.shopDomain === targetShop) ||
      shops[0] ||
      null;

    const selectedAlerts = selectedShop?.shopDomain
      ? alerts.filter((alert) => alert.shopDomain === selectedShop.shopDomain)
      : alerts.slice(0, 10);

    const primaryFocus = buildPrimaryFocus(selectedShop || undefined);
    const attackNow = buildAttackNow(selectedShop || undefined, alerts);
    const monitor = buildMonitor(selectedShop || undefined);

    const triageSeverity = !selectedShop
      ? "warn"
      : selectedShop.status === "rot"
        ? "critical"
        : selectedShop.status === "gelb"
          ? "warn"
          : "ok";

    const topProblemShops = shops.slice(0, 5).map(summarizeShop);

    const recentAttention = shops
      .slice()
      .sort((a, b) => parseTs(b.lastChatAt) - parseTs(a.lastChatAt))
      .slice(0, 5)
      .map((shop) => ({
        shopDomain: shop.shopDomain || "unknown",
        lastChatAt: shop.lastChatAt || "—",
        brainRequestCount24h: num(shop.brainRequestCount24h),
        commerceActionCount: num(shop.commerceActionCount),
      }));

    const selectedShopSummary = selectedShop ? summarizeShop(selectedShop) : null;

    return NextResponse.json({
      ok: true,
      source: data?.source || "unknown",
      generatedAt: new Date().toISOString(),
      targetShop: targetShop || null,
      targetContext: {
        canonicalType: "target",
        legacyRouteType: "shop",
        identifier: selectedShopSummary?.shopDomain || targetShop || null,
        label: selectedShopSummary?.shopDomain || targetShop || "unknown",
        platformAgnostic: true,
      },
      summary: data?.summary || {},
      efroAgent: {
        connected: efroAgent.connected,
        source: efroAgent.source,
        summary: efroSummary,
        error: efroAgent.error,
      },
      liveTruth: {
        primarySource: "efro_agent_watchdog_summary",
        handoffRole: "target_triage_and_history",
        summaryStatus: efroSummary?.summary_status || "unknown",
        ok: efroSummary?.ok ?? null,
        degraded: efroSummary?.degraded ?? null,
        enabled: efroSummary?.enabled ?? null,
        lastRunAt: efroSummary?.last_run_at || null,
        publicHealthConsecutiveFailures: efroSummary?.public_health_consecutive_failures ?? null,
        publicHealthIncidentThreshold: efroSummary?.public_health_incident_threshold ?? null,
      },
      triage: {
        severity: triageSeverity,
        primaryFocus,
        attackNow,
        monitor,
        selectedShop: selectedShopSummary,
        selectedShopAlerts: selectedAlerts,
        topProblemShops,
        recentAttention,
        liveSummaryStatus: efroSummary?.summary_status || "unknown",
        liveSummaryNote:
          "Primärstatus kommt aus dem EFRO-Agent-Watchdog; dieses Handoff bleibt Ziel-Triage- und Historienkontext.",
      },
      freezeInfo,
      debugPrompt: buildDebugPrompt(selectedShopSummary, primaryFocus, attackNow, efroAgent),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        generatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 }
    );
  }
}
