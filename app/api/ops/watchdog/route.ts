import { NextResponse } from "next/server";
import { getOverviewData } from "@/lib/ops-data";

type ShopLike = {
  shopDomain?: string;
  status?: string;
  productCount?: number;
  healthScore?: number;
  priorityScore?: number;
  nextAction?: string;
  commerceLastStatus?: string;
  responseCacheEntryCount?: number;
  brainRequestCount24h?: number;
  brainCacheHitCount24h?: number;
  estimatedCost24h?: number;
};

type AlertLike = {
  id?: string;
  shopDomain?: string;
  severity?: string;
  title?: string;
  detail?: string;
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

async function fetchEfroAgentSummary(): Promise<{
  ok: boolean;
  source: string;
  data: EfroAgentSummary | null;
  error?: string;
}> {
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
        ok: false,
        source: baseUrl,
        data: null,
        error: `http_${resp.status}`,
      };
    }

    const data = (await resp.json()) as EfroAgentSummary;
    return {
      ok: true,
      source: baseUrl,
      data,
    };
  } catch (error) {
    clearTimeout(timeout);
    return {
      ok: false,
      source: baseUrl,
      data: null,
      error: error instanceof Error ? error.message : "unknown_error",
    };
  }
}

export async function GET() {
  try {
    const data = (await getOverviewData()) as {
      ok?: boolean;
      source?: string;
      summary?: Record<string, unknown>;
      shops?: ShopLike[];
      alerts?: AlertLike[];
    };

    const shops = Array.isArray(data?.shops) ? data.shops : [];
    const alerts = Array.isArray(data?.alerts) ? data.alerts : [];

    const criticalShops = shops
      .filter((shop) => shop?.status === "rot")
      .map((shop) => ({
        shopDomain: shop.shopDomain || "unknown",
        healthScore: Number(shop.healthScore || 0),
        priorityScore: Number(shop.priorityScore || 0),
        nextAction: shop.nextAction || "Beobachten",
      }));

    const noProductShops = shops
      .filter((shop) => Number(shop?.productCount || 0) === 0)
      .map((shop) => ({
        shopDomain: shop.shopDomain || "unknown",
        productCount: Number(shop.productCount || 0),
        nextAction: shop.nextAction || "Shop-Installation pruefen",
      }));

    const commerceErrorShops = shops
      .filter((shop) => shop?.commerceLastStatus === "error")
      .map((shop) => ({
        shopDomain: shop.shopDomain || "unknown",
        commerceLastStatus: shop.commerceLastStatus || "error",
        nextAction: shop.nextAction || "Commerce pruefen",
      }));

    const zeroCacheHitShops = shops
      .filter(
        (shop) =>
          Number(shop?.brainRequestCount24h || 0) > 0 &&
          Number(shop?.brainCacheHitCount24h || 0) === 0
      )
      .map((shop) => ({
        shopDomain: shop.shopDomain || "unknown",
        brainRequestCount24h: Number(shop.brainRequestCount24h || 0),
        brainCacheHitCount24h: Number(shop.brainCacheHitCount24h || 0),
      }));

    const staleSyncAlerts = alerts
      .filter((alert) => String(alert?.id || "").startsWith("stale-sync-"))
      .map((alert) => ({
        shopDomain: alert.shopDomain || "unknown",
        severity: alert.severity || "warn",
        title: alert.title || "Sync veraltet",
        detail: alert.detail || "",
      }));

    const efroAgent = await fetchEfroAgentSummary();

    return NextResponse.json({
      ok: true,
      source: data?.source || "unknown",
      checkedAt: new Date().toISOString(),
      summary: data?.summary || {},
      watchdog: {
        criticalShopCount: criticalShops.length,
        noProductShopCount: noProductShops.length,
        commerceErrorShopCount: commerceErrorShops.length,
        zeroCacheHitShopCount: zeroCacheHitShops.length,
        staleSyncAlertCount: staleSyncAlerts.length,
        criticalShops,
        noProductShops,
        commerceErrorShops,
        zeroCacheHitShops,
        staleSyncAlerts,
      },
      efroAgent: {
        connected: efroAgent.ok,
        source: efroAgent.source,
        summary: efroAgent.data,
        error: efroAgent.error || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        checkedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 }
    );
  }
}
