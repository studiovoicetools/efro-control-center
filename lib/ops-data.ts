import type { AlertItem, ShopMetric } from "@/lib/types";
import { alerts as mockAlerts, freezeInfo, shopMetrics as mockShopMetrics } from "@/lib/mock-data";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ShopRow = {
  shop_domain: string;
  plan?: string | null;
  installed_at?: string | null;
  last_seen_at?: string | null;
  updated_at?: string | null;
};

type ProductRow = {
  shop_domain: string;
  title?: string | null;
  last_synced_at?: string | null;
};

type EventDailyRow = {
  shop_domain: string;
  day_utc?: string | null;
  query_count?: number | null;
  query_cache_hit_count?: number | null;
  tts_request_count?: number | null;
  tts_cache_hit_count?: number | null;
  tts_char_count_total?: number | null;
  tts_char_count_uncached?: number | null;
  brain_error_count?: number | null;
  tts_error_count?: number | null;
  last_event_at?: string | null;
};

type ConversationRow = {
  shop_domain: string;
  created_at?: string | null;
};

type AudioCacheStateRow = {
  audio_cache_entry_count?: number | null;
  audio_cache_hit_count?: number | null;
  last_audio_cache_used_at?: string | null;
};

type ResponseCacheStateRow = {
  shop_domain: string;
  response_cache_entry_count?: number | null;
  last_response_cache_at?: string | null;
};

type ActionLogRow = {
  shop?: string | null;
  created_at?: string | null;
  ok?: boolean | null;
  action_type?: string | null;
};

function formatTs(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 16).replace("T", " ");
}

function hoursSince(value?: string | null): number | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return (Date.now() - date.getTime()) / 1000 / 60 / 60;
}

const OPS_TTS_COST_PER_1K_UNCACHED_CHARS = Number(
  process.env.OPS_TTS_COST_PER_1K_UNCACHED_CHARS || 0
);

function estimateTtsCost24h(uncachedChars?: number | null): number {
  const chars = Number(uncachedChars || 0);
  const rate = Number.isFinite(OPS_TTS_COST_PER_1K_UNCACHED_CHARS)
    ? OPS_TTS_COST_PER_1K_UNCACHED_CHARS
    : 0;

  if (chars <= 0 || rate <= 0) return 0;
  return Number(((chars / 1000) * rate).toFixed(4));
}

function calcHealthScore(
  productCount: number,
  staleSync: boolean,
  inactive: boolean,
  duplicateCandidateCount: number,
  brainRequestCount24h: number,
  brainCacheHitCount24h: number,
  commerceLastStatus: string
): number {
  let score = 100;

  if (productCount === 0) score -= 50;
  else if (productCount < 20) score -= 20;

  if (staleSync) score -= 25;
  if (inactive) score -= 10;
  if (duplicateCandidateCount > 0) score -= Math.min(20, duplicateCandidateCount);

  if (brainRequestCount24h > 0) {
    const cacheRate = brainCacheHitCount24h / brainRequestCount24h;
    if (cacheRate < 0.2) score -= 10;
    else if (cacheRate < 0.4) score -= 5;
  }

  if (commerceLastStatus === "error") score -= 10;

  return Math.max(0, score);
}

function calcPriorityScore(input: {
  healthScore: number;
  staleSync: boolean;
  productCount: number;
  duplicateCandidateCount: number;
  brainRequestCount24h: number;
  brainCacheHitCount24h: number;
  commerceLastStatus: string;
}): number {
  let score = 100 - input.healthScore;

  if (input.staleSync) score += 25;
  if (input.productCount === 0) score += 30;
  if (input.productCount > 0 && input.productCount < 20) score += 10;
  if (input.duplicateCandidateCount > 0) score += Math.min(20, input.duplicateCandidateCount);
  if (input.brainRequestCount24h > 0 && input.brainCacheHitCount24h === 0) score += 10;
  if (input.commerceLastStatus === "error") score += 10;

  return Math.min(100, Math.max(0, score));
}

function buildNextAction(input: {
  productCount: number;
  staleSync: boolean;
  duplicateCandidateCount: number;
  brainRequestCount24h: number;
  brainCacheHitCount24h: number;
  commerceLastStatus: string;
}): string {
  if (input.productCount === 0) {
    return "Installation, Zugriffsdaten und Inhaltssynchronisierung sofort prüfen";
  }
  if (input.commerceLastStatus === "error") {
    return "Commerce-Flow und Aktionsfehler prüfen";
  }
  if (input.staleSync) {
    return "Inhaltssynchronisierung und Event-Anbindung prüfen";
  }
  if (input.duplicateCandidateCount > 0) {
    return "Inhaltsduplikate und Benennungsqualität prüfen";
  }
  if (input.brainRequestCount24h > 0 && input.brainCacheHitCount24h === 0) {
    return "Brain-Cache-Verhalten und Query-Normalisierung prüfen";
  }
  return "Beobachten, aktuell kein kritischer Eingriff nötig";
}

function statusFromScore(score: number): ShopMetric["status"] {
  if (score >= 90) return "gruen";
  if (score >= 70) return "gelb";
  return "rot";
}

async function loadRealOverviewData() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: shopRows, error: shopError } = await supabase
    .from("efro_shops")
    .select("shop_domain,plan,installed_at,last_seen_at,updated_at")
    .order("shop_domain");

  if (shopError) throw new Error(`efro_shops query failed: ${shopError.message}`);

  const { data: productRows, error: productError } = await supabase
    .from("products")
    .select("shop_domain,title,last_synced_at");

  if (productError) throw new Error(`products query failed: ${productError.message}`);

  let eventRows: EventDailyRow[] = [];
    try {
      const { data, error } = await supabase
        .from("ops_events_daily_v1")
        .select("shop_domain,day_utc,query_count,query_cache_hit_count,tts_request_count,tts_cache_hit_count,tts_char_count_total,tts_char_count_uncached,brain_error_count,tts_error_count,last_event_at")
        .gte("day_utc", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

      if (!error && data) {
        eventRows = data as EventDailyRow[];
      }
    } catch {}

  let conversationRows: ConversationRow[] = [];
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("shop_domain,created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (!error && data) {
      conversationRows = data as ConversationRow[];
    }
  } catch {}

    let audioCacheRows: AudioCacheStateRow[] = [];
    try {
      const { data, error } = await supabase
        .from("ops_global_audio_cache_state_v1")
        .select("audio_cache_entry_count,audio_cache_hit_count,last_audio_cache_used_at")
        .limit(1);

      if (!error && data) {
        audioCacheRows = data as AudioCacheStateRow[];
      }
    } catch {}

  let responseCacheRows: ResponseCacheStateRow[] = [];
  try {
    const { data, error } = await supabase
      .from("ops_shop_response_cache_state_v1")
      .select("shop_domain,response_cache_entry_count,last_response_cache_at");

    if (!error && data) {
      responseCacheRows = data as ResponseCacheStateRow[];
    }
  } catch {}

  let actionLogRows: ActionLogRow[] = [];
  try {
    const { data, error } = await supabase
      .from("efro_action_log")
      .select("shop,created_at,ok,action_type")
      .order("created_at", { ascending: false })
      .limit(500);

    if (!error && data) {
      actionLogRows = data as ActionLogRow[];
    }
  } catch {}

  const shops = (shopRows || []) as ShopRow[];
  const products = (productRows || []) as ProductRow[];

  const productByShop = new Map<
    string,
    {
      productCount: number;
      titles: string[];
      lastSyncAt: string | null;
    }
  >();

  for (const row of products) {
    const key = String(row.shop_domain || "").trim();
    if (!key) continue;

    const current = productByShop.get(key) || {
      productCount: 0,
      titles: [],
      lastSyncAt: null
    };

    current.productCount += 1;
    if (row.title) current.titles.push(String(row.title));

    if (row.last_synced_at) {
      if (!current.lastSyncAt || new Date(row.last_synced_at) > new Date(current.lastSyncAt)) {
        current.lastSyncAt = row.last_synced_at;
      }
    }

    productByShop.set(key, current);
  }

  const conversationByShop = new Map<string, string | null>();
  for (const row of conversationRows) {
    const key = String(row.shop_domain || "").trim();
    if (!key) continue;
    if (!conversationByShop.has(key)) {
      conversationByShop.set(key, row.created_at || null);
    }
  }

  const responseCacheByShop = new Map<
    string,
    {
      count: number;
      latestUpdatedAt: string | null;
    }
  >();

  for (const row of responseCacheRows) {
    const key = String(row.shop_domain || "").trim();
    if (!key) continue;
    responseCacheByShop.set(key, {
      count: Number(row.response_cache_entry_count || 0),
      latestUpdatedAt: row.last_response_cache_at || null
    });
  }

  const eventsByShop = new Map<
    string,
    {
      brainRequestCount24h: number;
      brainCacheHitCount24h: number;
      ttsRequestCount24h: number;
      ttsCacheHitCount24h: number;
      ttsCharCountTotal24h: number;
      ttsCharCountUncached24h: number;
      brainErrorCount24h: number;
      ttsErrorCount24h: number;
    }
  >();

  for (const row of eventRows) {
    const key = String(row.shop_domain || "").trim();
    if (!key) continue;

    const current = eventsByShop.get(key) || {
      brainRequestCount24h: 0,
      brainCacheHitCount24h: 0,
      ttsRequestCount24h: 0,
      ttsCacheHitCount24h: 0,
      ttsCharCountTotal24h: 0,
      ttsCharCountUncached24h: 0,
      brainErrorCount24h: 0,
      ttsErrorCount24h: 0
    };

    current.brainRequestCount24h += Number(row.query_count || 0);
    current.brainCacheHitCount24h += Number(row.query_cache_hit_count || 0);
    current.ttsRequestCount24h += Number(row.tts_request_count || 0);
    current.ttsCacheHitCount24h += Number(row.tts_cache_hit_count || 0);
    current.ttsCharCountTotal24h += Number(row.tts_char_count_total || 0);
    current.ttsCharCountUncached24h += Number(row.tts_char_count_uncached || 0);
    current.brainErrorCount24h += Number(row.brain_error_count || 0);
    current.ttsErrorCount24h += Number(row.tts_error_count || 0);

    eventsByShop.set(key, current);
  }

  const actionLogByShop = new Map<
    string,
    {
      commerceActionCount: number;
      commerceLastStatus: string;
      commerceLastActionType: string;
    }
  >();

  for (const row of actionLogRows) {
    const key = String(row.shop || "").trim();
    if (!key) continue;

    const current = actionLogByShop.get(key) || {
      commerceActionCount: 0,
      commerceLastStatus: "—",
      commerceLastActionType: "—"
    };

    current.commerceActionCount += 1;

    if (current.commerceLastStatus === "—") {
      current.commerceLastStatus = row.ok === true ? "ok" : row.ok === false ? "error" : "—";
      current.commerceLastActionType = row.action_type || "—";
    }

    actionLogByShop.set(key, current);
  }

    const audioState = audioCacheRows[0] || {
      audio_cache_entry_count: 0,
      audio_cache_hit_count: 0,
      last_audio_cache_used_at: null
    };

    const audioSummary = {
      audioCacheEntryCount: Number(audioState.audio_cache_entry_count || 0),
      audioCacheHitCount: Number(audioState.audio_cache_hit_count || 0)
    };

  const realShopMetrics: ShopMetric[] = shops.map((shop) => {
    const productInfo = productByShop.get(shop.shop_domain) || {
      productCount: 0,
      titles: [],
      lastSyncAt: null
    };

    const titleCounts = new Map<string, number>();
    for (const title of productInfo.titles) {
      const normalized = title.trim().toLowerCase();
      titleCounts.set(normalized, (titleCounts.get(normalized) || 0) + 1);
    }

    const duplicateCandidateCount = Array.from(titleCounts.values()).filter((count) => count > 1).length;
    const staleSync = (hoursSince(productInfo.lastSyncAt) ?? 9999) > 12;
    const inactive = (hoursSince(shop.last_seen_at) ?? 9999) > 24;

    const eventInfo = eventsByShop.get(shop.shop_domain) || {
      brainRequestCount24h: 0,
      brainCacheHitCount24h: 0,
      ttsRequestCount24h: 0,
      ttsCacheHitCount24h: 0,
      ttsCharCountTotal24h: 0,
      ttsCharCountUncached24h: 0,
      brainErrorCount24h: 0,
      ttsErrorCount24h: 0
    };

    const actionInfo = actionLogByShop.get(shop.shop_domain) || {
      commerceActionCount: 0,
      commerceLastStatus: "—",
      commerceLastActionType: "—"
    };

    const cacheInfo = responseCacheByShop.get(shop.shop_domain) || {
      count: 0,
      latestUpdatedAt: null
    };

    const derivedLastChatAt =
      conversationByShop.get(shop.shop_domain) ||
      cacheInfo.latestUpdatedAt ||
      null;

    const healthScore = calcHealthScore(
      productInfo.productCount,
      staleSync,
      inactive,
      duplicateCandidateCount,
      eventInfo.brainRequestCount24h,
      eventInfo.brainCacheHitCount24h,
      actionInfo.commerceLastStatus
    );

    const priorityScore = calcPriorityScore({
      healthScore,
      staleSync,
      productCount: productInfo.productCount,
      duplicateCandidateCount,
      brainRequestCount24h: eventInfo.brainRequestCount24h,
      brainCacheHitCount24h: eventInfo.brainCacheHitCount24h,
      commerceLastStatus: actionInfo.commerceLastStatus
    });

    const nextAction = buildNextAction({
      productCount: productInfo.productCount,
      staleSync,
      duplicateCandidateCount,
      brainRequestCount24h: eventInfo.brainRequestCount24h,
      brainCacheHitCount24h: eventInfo.brainCacheHitCount24h,
      commerceLastStatus: actionInfo.commerceLastStatus
    });

    return {
      shopDomain: shop.shop_domain,
      plan: shop.plan || "Unbekannt",
      status: statusFromScore(healthScore),
      installedAt: formatTs(shop.installed_at),
      lastSeenAt: formatTs(shop.last_seen_at || shop.updated_at),
      lastSyncAt: formatTs(productInfo.lastSyncAt),
      lastChatAt: formatTs(derivedLastChatAt),
      lastError: staleSync ? "Kein erfolgreicher Sync seit >12h" : null,
      productCount: productInfo.productCount,
      duplicateCandidateCount,
      responseCacheEntryCount: cacheInfo.count,
      brainRequestCount24h: eventInfo.brainRequestCount24h,
      brainCacheHitCount24h: eventInfo.brainCacheHitCount24h,
      audioCacheEntryCount: audioSummary.audioCacheEntryCount,
      audioCacheHitCount: audioSummary.audioCacheHitCount,
      commerceActionCount: actionInfo.commerceActionCount,
      commerceLastStatus: actionInfo.commerceLastStatus,
      commerceLastActionType: actionInfo.commerceLastActionType,
      estimatedCost24h: estimateTtsCost24h(eventInfo.ttsCharCountUncached24h),
      healthScore,
      priorityScore,
      nextAction
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const realAlerts: AlertItem[] = [];

  for (const shop of realShopMetrics) {
    if (shop.productCount === 0) {
      realAlerts.push({
        id: `no-products-${shop.shopDomain}`,
        shopDomain: shop.shopDomain,
        severity: "error",
        title: "Keine verwertbaren Inhalte gefunden",
        detail: "Für dieses Ziel wurden aktuell keine verwertbaren Inhalte oder Angebote gefunden."
      });
    }

    if (shop.lastError) {
      realAlerts.push({
        id: `stale-sync-${shop.shopDomain}`,
        shopDomain: shop.shopDomain,
        severity: "warn",
        title: "Sync veraltet",
        detail: shop.lastError
      });
    }

    if (shop.duplicateCandidateCount > 0) {
      realAlerts.push({
        id: `duplicates-${shop.shopDomain}`,
        shopDomain: shop.shopDomain,
        severity: "warn",
        title: "Potenzielle Duplikate",
        detail: `${shop.duplicateCandidateCount} doppelte Inhaltstitel oder Bezeichnungen erkannt.`
      });
    }

    if (shop.brainRequestCount24h > 0 && shop.brainCacheHitCount24h === 0) {
      realAlerts.push({
        id: `brain-cache-${shop.shopDomain}`,
        shopDomain: shop.shopDomain,
        severity: "warn",
        title: "Kein Brain-Cache-Hit in 24h",
        detail: "Es gab Brain-Requests, aber keinen erfassten Cache-Hit in den letzten 24 Stunden."
      });
    }

    if (shop.commerceLastStatus === "error") {
      realAlerts.push({
        id: `commerce-${shop.shopDomain}`,
        shopDomain: shop.shopDomain,
        severity: "warn",
        title: "Letzte Commerce-Aktion fehlgeschlagen",
        detail: `Letzter Commerce-Typ: ${shop.commerceLastActionType}`
      });
    }
  }

  const redShops = realShopMetrics.filter((s) => s.status === "rot").length;
  const yellowShops = realShopMetrics.filter((s) => s.status === "gelb").length;
  const totalCost24h = realShopMetrics.reduce((sum, shop) => sum + shop.estimatedCost24h, 0);
  const cacheRateShops = realShopMetrics.filter((shop) => shop.brainRequestCount24h > 0);
  const avgBrainCacheHitRate =
    cacheRateShops.length > 0
      ? cacheRateShops.reduce((sum, shop) => {
          return sum + shop.brainCacheHitCount24h / shop.brainRequestCount24h;
        }, 0) / cacheRateShops.length
      : 0;

  return {
    ok: true,
    summary: {
      totalShops: realShopMetrics.length,
      redShops,
      yellowShops,
      totalCost24h,
      avgBrainCacheHitRate,
      globalAudioCacheEntryCount: audioSummary.audioCacheEntryCount,
      globalAudioCacheHitCount: audioSummary.audioCacheHitCount
    },
    freezeInfo,
    alerts: realAlerts,
    shops: realShopMetrics,
    source: "supabase"
  };
}

export async function getOverviewData() {
  try {
    const real = await loadRealOverviewData();
    if (real) return real;
  } catch (error) {
    console.error("getOverviewData fallback to mock:", error);
  }

  const redShops = mockShopMetrics.filter((s) => s.status === "rot").length;
  const yellowShops = mockShopMetrics.filter((s) => s.status === "gelb").length;
  const totalCost24h = mockShopMetrics.reduce((sum, shop) => sum + shop.estimatedCost24h, 0);
  const cacheRateShops = mockShopMetrics.filter((shop) => shop.brainRequestCount24h > 0);
  const avgBrainCacheHitRate =
    cacheRateShops.length > 0
      ? cacheRateShops.reduce((sum, shop) => {
          return sum + shop.brainCacheHitCount24h / shop.brainRequestCount24h;
        }, 0) / cacheRateShops.length
      : 0;

  return {
    ok: true,
    summary: {
      totalShops: mockShopMetrics.length,
      redShops,
      yellowShops,
      totalCost24h,
      avgBrainCacheHitRate,
      globalAudioCacheEntryCount: mockShopMetrics[0]?.audioCacheEntryCount || 0,
      globalAudioCacheHitCount: mockShopMetrics[0]?.audioCacheHitCount || 0
    },
    freezeInfo,
    alerts: mockAlerts,
    shops: [...mockShopMetrics].sort((a, b) => b.priorityScore - a.priorityScore),
    source: "mock"
  };
}

export async function getShopDetailData(shopDomain: string) {
  const overview = await getOverviewData();
  const shop = overview.shops.find((item) => item.shopDomain === shopDomain);

  if (!shop) {
    return {
      ok: false as const,
      error: "shop_not_found" as const
    };
  }

  const shopAlerts = overview.alerts.filter((item) => item.shopDomain === shopDomain);

  return {
    ok: true as const,
    shop,
    alerts: shopAlerts,
    source: overview.source,
    globalAudioCacheEntryCount: overview.summary.globalAudioCacheEntryCount,
    globalAudioCacheHitCount: overview.summary.globalAudioCacheHitCount
  };
}
