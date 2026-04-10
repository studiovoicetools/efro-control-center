import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ProductRow = {
  title?: string | null;
  price?: number | null;
  shopify_product_id?: string | null;
  shopify_variant_id?: string | null;
  sku?: string | null;
  last_synced_at?: string | null;
};

type CacheResponseRow = {
  query?: string | null;
  reply_text?: string | null;
  updated_at?: string | null;
};

type ActionLogRow = {
  created_at?: string | null;
  action_type?: string | null;
  ok?: boolean | null;
  status_code?: number | null;
  error?: unknown;
  token_source?: string | null;
};

type ConversationRow = {
  created_at?: string | null;
  shop_domain?: string | null;
};

type EventRow = {
  created_at?: string | null;
  type?: string | null;
  data?: unknown;
};

function topDuplicateTitles(rows: ProductRow[]) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const title = String(row.title || "").trim();
    if (!title) continue;
    const normalized = title.toLowerCase();
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([title, count]) => ({ title, count }));
}

export async function GET(
  _request: Request,
  { params }: { params: { shop: string } }
) {
  const supabase = getSupabaseAdmin();
  const shopDomain = decodeURIComponent(params.shop);

  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 }
    );
  }

  const warnings: string[] = [];
  const notes: string[] = [];

  let productRows: ProductRow[] = [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("title,price,shopify_product_id,shopify_variant_id,sku,last_synced_at")
      .eq("shop_domain", shopDomain)
      .limit(5000);

    if (error) warnings.push(`products: ${error.message}`);
    else productRows = (data || []) as ProductRow[];
  } catch (err: any) {
    warnings.push(`products: ${err?.message || String(err)}`);
  }

  let cacheRows: CacheResponseRow[] = [];
  try {
    const { data, error } = await supabase
      .from("cache_responses")
      .select("query,reply_text,updated_at")
      .eq("shop_domain", shopDomain)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error) warnings.push(`cache_responses: ${error.message}`);
    else cacheRows = (data || []) as CacheResponseRow[];
  } catch (err: any) {
    warnings.push(`cache_responses: ${err?.message || String(err)}`);
  }

  let actionRows: ActionLogRow[] = [];
  try {
    const { data, error } = await supabase
      .from("efro_action_log")
      .select("created_at,action_type,ok,status_code,error,token_source")
      .eq("shop", shopDomain)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) warnings.push(`efro_action_log: ${error.message}`);
    else actionRows = (data || []) as ActionLogRow[];
  } catch (err: any) {
    warnings.push(`efro_action_log: ${err?.message || String(err)}`);
  }

  let conversationRows: ConversationRow[] = [];
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("created_at,shop_domain")
      .eq("shop_domain", shopDomain)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) warnings.push(`conversations: ${error.message}`);
    else {
      conversationRows = (data || []) as ConversationRow[];
      if (conversationRows.length === 0) {
        notes.push("conversations ist aktuell leer; lastChatAt wird im Dashboard aus cache_responses abgeleitet.");
      }
    }
  } catch (err: any) {
    warnings.push(`conversations: ${err?.message || String(err)}`);
  }

  let eventRows: EventRow[] = [];
  try {
    const { data, error } = await supabase
      .from("events")
      .select("created_at,type,data")
      .eq("shop_domain", shopDomain)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      if (String(error.message).includes("Could not find the table")) {
        notes.push("events-Tabelle fehlt aktuell; Brain-24h-Zähler sind deshalb noch nicht exakt messbar.");
      } else {
        warnings.push(`events: ${error.message}`);
      }
    } else {
      eventRows = (data || []) as EventRow[];
    }
  } catch (err: any) {
    const message = String(err?.message || err);
    if (message.includes("Could not find the table")) {
      notes.push("events-Tabelle fehlt aktuell; Brain-24h-Zähler sind deshalb noch nicht exakt messbar.");
    } else {
      warnings.push(`events: ${message}`);
    }
  }

  return NextResponse.json({
    ok: true,
    shopDomain,
    warnings,
    notes,
    summary: {
      productRowCount: productRows.length,
      responseCacheEntryCount: cacheRows.length,
      commerceActionCount: actionRows.length,
      conversationCount: conversationRows.length,
      eventCount: eventRows.length
    },
    duplicateTitlesTop: topDuplicateTitles(productRows),
    latestResponseCache: cacheRows,
    latestCommerceActions: actionRows,
    latestConversations: conversationRows,
    latestEvents: eventRows
  });
}
