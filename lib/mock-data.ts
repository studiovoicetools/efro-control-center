import type { AlertItem, FreezeInfo, ShopMetric } from "@/lib/types";

export const freezeInfo: FreezeInfo[] = [
  {
    repo: "efro-brain",
    tag: "submission-freeze-2026-03-28-164814-efro-brain",
    commit: "8a606de80b7fa2bd40221c1d454406a0f9457174",
    parallelBranch: "parallel/efro-brain-2026-03-28-164814"
  },
  {
    repo: "efro-shopify",
    tag: "submission-freeze-2026-03-28-164814-efro-shopify",
    commit: "0ddf457f478425f0b483808e0076add368b1c900",
    parallelBranch: "parallel/efro-shopify-2026-03-28-164814"
  },
  {
    repo: "efro-widget",
    tag: "submission-freeze-2026-03-28-164814-efro-widget",
    commit: "ba946c471f241584d8c11e068d219206691a6270",
    parallelBranch: "parallel/efro-widget-2026-03-28-164814"
  }
];

export const shopMetrics: ShopMetric[] = [
  {
    shopDomain: "avatarsalespro-dev.myshopify.com",
    plan: "Demo / Dev",
    status: "gelb",
    installedAt: "2026-01-04 14:29",
    lastSeenAt: "2026-03-28 16:03",
    lastSyncAt: "2026-03-28 15:23",
    lastChatAt: "2026-03-28 16:01",
    lastError: "Voice im Shopify-Admin absichtlich deaktiviert",
    productCount: 87,
    duplicateCandidateCount: 0,
    responseCacheEntryCount: 12,
    brainRequestCount24h: 32,
    brainCacheHitCount24h: 19,
    audioCacheEntryCount: 17,
    audioCacheHitCount: 51,
    commerceActionCount: 8,
    commerceLastStatus: "ok",
    commerceLastActionType: "CREATE_DRAFT_ORDER_CHECKOUT",
    estimatedCost24h: 8.7,
    healthScore: 81,
    priorityScore: 35,
    nextAction: "Voice-Kosten und Admin-/Storefront-Trennung weiter überwachen"
  },
  {
    shopDomain: "demo-tv-store.myshopify.com",
    plan: "Starter",
    status: "rot",
    installedAt: "2026-03-25 10:11",
    lastSeenAt: "2026-03-28 08:42",
    lastSyncAt: "2026-03-27 23:10",
    lastChatAt: "—",
    lastError: "Kein erfolgreicher Sync seit >12h",
    productCount: 14,
    duplicateCandidateCount: 2,
    responseCacheEntryCount: 1,
    brainRequestCount24h: 4,
    brainCacheHitCount24h: 0,
    audioCacheEntryCount: 0,
    audioCacheHitCount: 0,
    commerceActionCount: 0,
    commerceLastStatus: "—",
    commerceLastActionType: "—",
    estimatedCost24h: 19.4,
    healthScore: 54,
    priorityScore: 82,
    nextAction: "Produkt-Sync, Katalogqualität und Cache-Verhalten sofort prüfen"
  },
  {
    shopDomain: "snow-lab.myshopify.com",
    plan: "Pro",
    status: "gruen",
    installedAt: "2026-03-12 09:05",
    lastSeenAt: "2026-03-28 15:57",
    lastSyncAt: "2026-03-28 15:49",
    lastChatAt: "2026-03-28 15:55",
    lastError: null,
    productCount: 132,
    duplicateCandidateCount: 0,
    responseCacheEntryCount: 9,
    brainRequestCount24h: 21,
    brainCacheHitCount24h: 14,
    audioCacheEntryCount: 8,
    audioCacheHitCount: 24,
    commerceActionCount: 3,
    commerceLastStatus: "ok",
    commerceLastActionType: "UPDATE_DRAFT_ORDER_LINE_QTY",
    estimatedCost24h: 4.9,
    healthScore: 94,
    priorityScore: 8,
    nextAction: "Nur beobachten, aktuell kein kritischer Eingriff nötig"
  }
];

export const alerts: AlertItem[] = [
  {
    id: "alert-001",
    shopDomain: "demo-tv-store.myshopify.com",
    severity: "error",
    title: "Sync veraltet",
    detail: "Seit über 12 Stunden kein erfolgreicher Produkt-Sync."
  },
  {
    id: "alert-002",
    shopDomain: "demo-tv-store.myshopify.com",
    severity: "warn",
    title: "Hohe Voice-Kosten",
    detail: "Kosten der letzten 24h liegen deutlich über dem aktuellen Durchschnitt."
  },
  {
    id: "alert-003",
    shopDomain: "avatarsalespro-dev.myshopify.com",
    severity: "info",
    title: "Admin-Voice deaktiviert",
    detail: "Im Shopify-Admin absichtlich deaktiviert, Storefront-Voice bleibt aktiv."
  }
];
