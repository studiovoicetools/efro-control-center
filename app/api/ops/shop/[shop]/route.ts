import { NextResponse } from "next/server";
import { getShopDetailData } from "@/lib/ops-data";

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

export async function GET(
  _request: Request,
  { params }: { params: { shop: string } }
) {
  const shopDomain = decodeURIComponent(params.shop);
  const [data, efroAgent] = await Promise.all([
    getShopDetailData(shopDomain),
    fetchEfroAgentSummary(),
  ]);

  const efroSummary = efroAgent.summary;

  const payload = {
    ...data,
    efroAgent: {
      connected: efroAgent.connected,
      source: efroAgent.source,
      summary: efroSummary,
      error: efroAgent.error,
    },
    liveTruth: {
      primarySource: "efro_agent_watchdog_summary",
      detailRole: "shop_context_plus_live_status",
      summaryStatus: efroSummary?.summary_status || "unknown",
      ok: efroSummary?.ok ?? null,
      degraded: efroSummary?.degraded ?? null,
      enabled: efroSummary?.enabled ?? null,
      lastRunAt: efroSummary?.last_run_at || null,
      publicHealthConsecutiveFailures:
        efroSummary?.public_health_consecutive_failures ?? null,
      publicHealthIncidentThreshold:
        efroSummary?.public_health_incident_threshold ?? null,
    },
  };

  if (!data.ok) {
    return NextResponse.json(payload, { status: 404 });
  }

  return NextResponse.json(payload);
}
