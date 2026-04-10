export type HealthStatus = "gruen" | "gelb" | "rot";

export interface ShopMetric {
  shopDomain: string;
  plan: string;
  status: HealthStatus;
  installedAt: string;
  lastSeenAt: string;
  lastSyncAt: string;
  lastChatAt: string;
  lastError: string | null;
  productCount: number;
  duplicateCandidateCount: number;
  responseCacheEntryCount: number;
  brainRequestCount24h: number;
  brainCacheHitCount24h: number;
  audioCacheEntryCount: number;
  audioCacheHitCount: number;
  commerceActionCount: number;
  commerceLastStatus: string;
  commerceLastActionType: string;
  estimatedCost24h: number;
  healthScore: number;
  priorityScore: number;
  nextAction: string;
}

export interface AlertItem {
  id: string;
  shopDomain: string;
  severity: "info" | "warn" | "error";
  title: string;
  detail: string;
}

export interface FreezeInfo {
  repo: string;
  tag: string;
  commit: string;
  parallelBranch: string;
}
