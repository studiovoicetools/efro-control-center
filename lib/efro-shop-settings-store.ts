import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type {
  ShopSettings,
  EfroLanguage,
  OnboardingStep,
  ShopFeatureFlag,
} from "@/lib/efro-product-model";
import {
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_LANGUAGE,
  DEFAULT_ONBOARDING_STEP,
  createDefaultShopSettings,
} from "@/lib/efro-product-model";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "efro-shop-settings.json");

const VALID_LANGUAGES: EfroLanguage[] = ["de", "en", "mixed"];
const VALID_ONBOARDING_STEPS: OnboardingStep[] = ["avatar", "voice", "language", "review", "done"];
const VALID_FEATURE_FLAGS: ShopFeatureFlag[] = [
  "avatar",
  "voice",
  "chat",
  "product_recommendations",
  "commerce_actions",
  "catalog_optimization",
  "watchdog",
  "customer_dashboard",
];

type SupabaseSettingsRow = {
  shop?: string;
  avatar_id?: string | null;
  voice_id?: string | null;
  locale?: string | null;
  selected_language?: EfroLanguage | null;
  onboarding_completed?: boolean | null;
  onboarding_step?: OnboardingStep | null;
  avatar_enabled?: boolean | null;
  voice_enabled?: boolean | null;
  chat_enabled?: boolean | null;
  demo_mode?: boolean | null;
  feature_flags?: unknown;
  updated_at?: string | null;
};

type RawSettingsRecord = SupabaseSettingsRow;

export type ShopSettingsPatch = Partial<{
  selectedAvatarId: string | null;
  selectedVoiceId: string | null;
  selectedLanguage: EfroLanguage;
  onboardingCompleted: boolean;
  onboardingStep: OnboardingStep;
  avatarEnabled: boolean;
  voiceEnabled: boolean;
  chatEnabled: boolean;
  demoMode: boolean;
  featureFlags: ShopFeatureFlag[];
}>;

export type PersistedSettingsLoadResult = {
  settings: ShopSettings | null;
  source: "supabase" | "local" | "default";
};

export type PersistedSettingsSaveResult = {
  ok: boolean;
  persisted: boolean;
  source: "supabase" | "local";
  settings: ShopSettings;
  warning?: string | null;
};

function isLanguage(value: unknown): value is EfroLanguage {
  return VALID_LANGUAGES.includes(value as EfroLanguage);
}

function isOnboardingStep(value: unknown): value is OnboardingStep {
  return VALID_ONBOARDING_STEPS.includes(value as OnboardingStep);
}

function isFeatureFlag(value: unknown): value is ShopFeatureFlag {
  return VALID_FEATURE_FLAGS.includes(value as ShopFeatureFlag);
}

function normalizeFeatureFlags(value: unknown): ShopFeatureFlag[] {
  if (!Array.isArray(value)) return [...DEFAULT_FEATURE_FLAGS];
  const filtered = value.filter(isFeatureFlag);
  return filtered.length > 0 ? Array.from(new Set(filtered)) : [...DEFAULT_FEATURE_FLAGS];
}

function inferLanguageFromLocale(locale?: string | null): EfroLanguage {
  const normalized = String(locale || "").toLowerCase();
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("de")) return "de";
  return DEFAULT_LANGUAGE;
}

function languageToLocale(language: EfroLanguage): string {
  if (language === "en") return "en-US";
  if (language === "mixed") return "de-DE";
  return "de-DE";
}

function normalizeSettings(shopDomain: string, raw?: RawSettingsRecord | null): ShopSettings {
  const base = createDefaultShopSettings(shopDomain);
  const selectedLanguage =
    isLanguage(raw?.selected_language) ? raw!.selected_language : inferLanguageFromLocale(raw?.locale);

  return {
    ...base,
    selectedAvatarId:
      typeof raw?.avatar_id === "string" || raw?.avatar_id === null
        ? raw?.avatar_id ?? null
        : base.selectedAvatarId ?? null,
    selectedVoiceId:
      typeof raw?.voice_id === "string" || raw?.voice_id === null
        ? raw?.voice_id ?? null
        : base.selectedVoiceId ?? null,
    selectedLanguage: selectedLanguage || base.selectedLanguage || DEFAULT_LANGUAGE,
    onboardingCompleted:
      typeof raw?.onboarding_completed === "boolean"
        ? raw.onboarding_completed
        : base.onboardingCompleted,
    onboardingStep: isOnboardingStep(raw?.onboarding_step)
      ? raw!.onboarding_step
      : base.onboardingStep || DEFAULT_ONBOARDING_STEP,
    avatarEnabled:
      typeof raw?.avatar_enabled === "boolean" ? raw.avatar_enabled : base.avatarEnabled,
    voiceEnabled:
      typeof raw?.voice_enabled === "boolean" ? raw.voice_enabled : base.voiceEnabled,
    chatEnabled:
      typeof raw?.chat_enabled === "boolean" ? raw.chat_enabled : base.chatEnabled,
    demoMode:
      typeof raw?.demo_mode === "boolean" ? raw.demo_mode : base.demoMode,
    featureFlags: normalizeFeatureFlags(raw?.feature_flags),
    updatedAt:
      typeof raw?.updated_at === "string" && raw.updated_at.trim()
        ? raw.updated_at
        : base.updatedAt,
  };
}

function toSupabaseRow(shopDomain: string, settings: ShopSettings): SupabaseSettingsRow {
  return {
    shop: shopDomain,
    avatar_id: settings.selectedAvatarId ?? null,
    voice_id: settings.selectedVoiceId ?? null,
    locale: languageToLocale(settings.selectedLanguage),
    selected_language: settings.selectedLanguage,
    onboarding_completed: settings.onboardingCompleted,
    onboarding_step: settings.onboardingStep,
    avatar_enabled: settings.avatarEnabled,
    voice_enabled: settings.voiceEnabled,
    chat_enabled: settings.chatEnabled,
    demo_mode: settings.demoMode,
    feature_flags: settings.featureFlags,
    updated_at: settings.updatedAt ?? new Date().toISOString(),
  };
}

function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function ensureLocalDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readLocalStore(): Promise<Record<string, RawSettingsRecord>> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeLocalStore(store: Record<string, RawSettingsRecord>) {
  await ensureLocalDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function applyPatch(base: ShopSettings, patch: ShopSettingsPatch): ShopSettings {
  return {
    ...base,
    selectedAvatarId:
      patch.selectedAvatarId !== undefined ? patch.selectedAvatarId : base.selectedAvatarId ?? null,
    selectedVoiceId:
      patch.selectedVoiceId !== undefined ? patch.selectedVoiceId : base.selectedVoiceId ?? null,
    selectedLanguage:
      patch.selectedLanguage !== undefined && isLanguage(patch.selectedLanguage)
        ? patch.selectedLanguage
        : base.selectedLanguage || DEFAULT_LANGUAGE,
    onboardingCompleted:
      patch.onboardingCompleted !== undefined
        ? Boolean(patch.onboardingCompleted)
        : base.onboardingCompleted,
    onboardingStep:
      patch.onboardingStep !== undefined && isOnboardingStep(patch.onboardingStep)
        ? patch.onboardingStep
        : base.onboardingStep || DEFAULT_ONBOARDING_STEP,
    avatarEnabled:
      patch.avatarEnabled !== undefined ? Boolean(patch.avatarEnabled) : base.avatarEnabled,
    voiceEnabled:
      patch.voiceEnabled !== undefined ? Boolean(patch.voiceEnabled) : base.voiceEnabled,
    chatEnabled:
      patch.chatEnabled !== undefined ? Boolean(patch.chatEnabled) : base.chatEnabled,
    demoMode:
      patch.demoMode !== undefined ? Boolean(patch.demoMode) : base.demoMode,
    featureFlags:
      patch.featureFlags !== undefined
        ? normalizeFeatureFlags(patch.featureFlags)
        : base.featureFlags,
    updatedAt: new Date().toISOString(),
  };
}

export async function loadPersistedShopSettings(
  shopDomain: string
): Promise<PersistedSettingsLoadResult> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("efro_shop_settings")
        .select(
          "shop,avatar_id,voice_id,locale,selected_language,onboarding_completed,onboarding_step,avatar_enabled,voice_enabled,chat_enabled,demo_mode,feature_flags,updated_at"
        )
        .eq("shop", shopDomain)
        .maybeSingle();

      if (!error && data) {
        return {
          settings: normalizeSettings(shopDomain, data as RawSettingsRecord),
          source: "supabase",
        };
      }
    } catch {}
  }

  try {
    const store = await readLocalStore();
    const record = store[shopDomain];
    if (record) {
      return {
        settings: normalizeSettings(shopDomain, record),
        source: "local",
      };
    }
  } catch {}

  return {
    settings: null,
    source: "default",
  };
}

export async function savePersistedShopSettings(
  shopDomain: string,
  patch: ShopSettingsPatch
): Promise<PersistedSettingsSaveResult> {
  const loaded = await loadPersistedShopSettings(shopDomain);
  const base = loaded.settings || createDefaultShopSettings(shopDomain);
  const merged = applyPatch(base, patch);
  const rawRecord = toSupabaseRow(shopDomain, merged);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("efro_shop_settings")
        .upsert(rawRecord, { onConflict: "shop" });

      if (!error) {
        return {
          ok: true,
          persisted: true,
          source: "supabase",
          settings: merged,
        };
      }
    } catch {}
  }

  const store = await readLocalStore();
  store[shopDomain] = rawRecord;
  await writeLocalStore(store);

  return {
    ok: true,
    persisted: true,
    source: "local",
    settings: merged,
    warning: "supabase_unavailable_or_table_missing_fallback_local_store_used",
  };
}
