import { getOverviewData } from "@/lib/ops-data";
import type { ShopSettings, EfroLanguage } from "@/lib/efro-product-model";
import {
  createInitialShopSettings,
  getAvatarById,
  getVisibleAvatars,
  getVisibleVoices,
  getVoiceById,
} from "@/lib/efro-product-catalog";
import { loadPersistedShopSettings } from "@/lib/efro-shop-settings-store";

type OverviewShopLike = {
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

type AlertLike = {
  id?: string;
  shopDomain?: string;
  severity?: string;
  title?: string;
  detail?: string;
};

type OverviewDataLike = {
  ok?: boolean;
  source?: string;
  summary?: Record<string, unknown>;
  shops?: OverviewShopLike[];
  alerts?: AlertLike[];
};

function inferLanguageFromShop(shop?: OverviewShopLike | null): EfroLanguage {
  if (!shop) return "de";
  const domain = String(shop.shopDomain || "").toLowerCase();
  if (domain.includes("-en") || domain.includes("english")) return "en";
  return "de";
}

function normalizeSettings(settings: ShopSettings, shop?: OverviewShopLike | null): ShopSettings {
  const inferredLanguage = inferLanguageFromShop(shop);
  const language = settings.selectedLanguage || inferredLanguage || "de";
  const visibleAvatars = getVisibleAvatars("customer");
  const visibleVoices = getVisibleVoices(language, "customer");

  const selectedAvatar =
    getAvatarById(settings.selectedAvatarId) ||
    visibleAvatars[0] ||
    null;

  const selectedVoice =
    getVoiceById(settings.selectedVoiceId) ||
    visibleVoices[0] ||
    null;

  return {
    ...settings,
    selectedLanguage: language,
    selectedAvatarId: selectedAvatar?.id || null,
    selectedVoiceId: selectedVoice?.id || null,
    updatedAt: new Date().toISOString(),
  };
}

export async function getShopConfigSnapshot(shopDomain: string) {
  const data: OverviewDataLike = await getOverviewData();
  const shops = Array.isArray(data?.shops) ? data.shops : [];
  const alerts = Array.isArray(data?.alerts) ? data.alerts : [];
  const shop = shops.find((item) => item.shopDomain === shopDomain) || null;

  const persisted = await loadPersistedShopSettings(shopDomain);
  const baseSettings = persisted.settings || createInitialShopSettings(shopDomain);
  const settings = normalizeSettings(baseSettings, shop);

  const selectedAvatar = getAvatarById(settings.selectedAvatarId);
  const selectedVoice = getVoiceById(settings.selectedVoiceId);

  return {
    ok: true,
    source: data?.source || "unknown",
    settingsSource: persisted.source,
    generatedAt: new Date().toISOString(),
    shopDomain,
    settings,
    selectedAvatar,
    selectedVoice,
    availableAvatars: getVisibleAvatars("customer"),
    availableVoices: getVisibleVoices(settings.selectedLanguage, "customer"),
    shopOverview: shop,
    shopAlerts: alerts.filter((alert) => alert.shopDomain === shopDomain),
  };
}
