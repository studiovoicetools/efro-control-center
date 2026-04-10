import type {
  AvatarCatalogItem,
  VoiceCatalogItem,
  EfroLanguage,
  ShopSettings,
} from "@/lib/efro-product-model";
import { DEFAULT_LANGUAGE, createDefaultShopSettings } from "@/lib/efro-product-model";

export const EFRO_AVATAR_CATALOG: AvatarCatalogItem[] = [
  {
    id: "avatar-cyber-bear",
    slug: "cyber-bear",
    label: "Cyber Bear",
    description: "Freundlich, modern, universal.",
    rivFile: "/bear.riv",
    previewImageUrl: null,
    tags: ["friendly", "modern", "universal"],
    languages: ["de", "en", "mixed"],
    provider: "rive",
    status: "active",
    visibility: "customer",
    supportsLipSync: true,
    supportsPreview: true,
    sortOrder: 10,
  },
  {
    id: "avatar-smart-cat",
    slug: "smart-cat",
    label: "Smart Cat",
    description: "Charmant, verspielt, aufmerksam.",
    rivFile: "/cat.riv",
    previewImageUrl: null,
    tags: ["playful", "charming", "attentive"],
    languages: ["de", "en", "mixed"],
    provider: "rive",
    status: "active",
    visibility: "customer",
    supportsLipSync: true,
    supportsPreview: true,
    sortOrder: 20,
  },
  {
    id: "avatar-cyber-girl",
    slug: "cyber-girl",
    label: "Cyber Girl",
    description: "Futuristisch, dynamisch, direkt.",
    rivFile: "/cyberGirl.riv",
    previewImageUrl: null,
    tags: ["futuristic", "dynamic", "direct"],
    languages: ["de", "en", "mixed"],
    provider: "rive",
    status: "beta",
    visibility: "customer",
    supportsLipSync: true,
    supportsPreview: true,
    sortOrder: 30,
  },
  {
    id: "avatar-mascot-cat",
    slug: "mascot-cat",
    label: "Mascot Cat",
    description: "Sympathische Creator-Begleitung.",
    rivFile: "/mascotCat.riv",
    previewImageUrl: null,
    tags: ["creator", "friendly", "mascot"],
    languages: ["de", "en", "mixed"],
    provider: "rive",
    status: "beta",
    visibility: "customer",
    supportsLipSync: true,
    supportsPreview: true,
    sortOrder: 40,
  },
  {
    id: "avatar-notion-guys",
    slug: "notion-guys",
    label: "Notion Guys",
    description: "Locker, creator-orientiert.",
    rivFile: "/notionGuys.riv",
    previewImageUrl: null,
    tags: ["creator", "casual", "content"],
    languages: ["de", "en", "mixed"],
    provider: "rive",
    status: "beta",
    visibility: "customer",
    supportsLipSync: true,
    supportsPreview: true,
    sortOrder: 50,
  },
  {
    id: "avatar-realistic-female",
    slug: "realistic-female",
    label: "Realistic Female",
    description: "Seriös, nahbar, professionell.",
    rivFile: "/realisticFemale.riv",
    previewImageUrl: null,
    tags: ["professional", "serious", "approachable"],
    languages: ["de", "en", "mixed"],
    provider: "rive",
    status: "active",
    visibility: "customer",
    supportsLipSync: true,
    supportsPreview: true,
    sortOrder: 60,
  },
  {
    id: "avatar-retro-bot",
    slug: "retro-bot",
    label: "Retro Bot",
    description: "Technoid, attention-grabber.",
    rivFile: "/retroBot.riv",
    previewImageUrl: null,
    tags: ["tech", "robot", "attention"],
    languages: ["de", "en", "mixed"],
    provider: "rive",
    status: "beta",
    visibility: "customer",
    supportsLipSync: true,
    supportsPreview: true,
    sortOrder: 70,
  },
];

export const EFRO_VOICE_CATALOG: VoiceCatalogItem[] = [
  {
    id: "voice-de-female-soft-1",
    slug: "de-female-soft-1",
    label: "Deutsch · Female Soft 1",
    description: "Weich, freundlich, kundenorientiert.",
    provider: "elevenlabs",
    providerVoiceKey: "DE_FEMALE_SOFT_1",
    language: "de",
    gender: "female",
    toneTags: ["soft", "friendly", "sales"],
    status: "active",
    visibility: "customer",
    supportsPreview: true,
    sortOrder: 10,
  },
  {
    id: "voice-de-female-soft-2",
    slug: "de-female-soft-2",
    label: "Deutsch · Female Soft 2",
    description: "Ruhig, hochwertig, elegant.",
    provider: "elevenlabs",
    providerVoiceKey: "DE_FEMALE_SOFT_2",
    language: "de",
    gender: "female",
    toneTags: ["calm", "premium", "elegant"],
    status: "active",
    visibility: "customer",
    supportsPreview: true,
    sortOrder: 20,
  },
  {
    id: "voice-de-male-confident-1",
    slug: "de-male-confident-1",
    label: "Deutsch · Male Confident 1",
    description: "Klar, sicher, beratend.",
    provider: "elevenlabs",
    providerVoiceKey: "DE_MALE_CONFIDENT_1",
    language: "de",
    gender: "male",
    toneTags: ["confident", "clear", "advisor"],
    status: "active",
    visibility: "customer",
    supportsPreview: true,
    sortOrder: 30,
  },
  {
    id: "voice-de-male-confident-2",
    slug: "de-male-confident-2",
    label: "Deutsch · Male Confident 2",
    description: "Direkt, stark, sales-orientiert.",
    provider: "elevenlabs",
    providerVoiceKey: "DE_MALE_CONFIDENT_2",
    language: "de",
    gender: "male",
    toneTags: ["direct", "strong", "sales"],
    status: "beta",
    visibility: "customer",
    supportsPreview: true,
    sortOrder: 40,
  },
  {
    id: "voice-en-female-clear-1",
    slug: "en-female-clear-1",
    label: "English · Female Clear 1",
    description: "Clear, modern, international.",
    provider: "elevenlabs",
    providerVoiceKey: "EN_FEMALE_CLEAR_1",
    language: "en",
    gender: "female",
    toneTags: ["clear", "modern", "international"],
    status: "beta",
    visibility: "internal",
    supportsPreview: true,
    sortOrder: 50,
  },
  {
    id: "voice-en-male-clear-1",
    slug: "en-male-clear-1",
    label: "English · Male Clear 1",
    description: "Direct, clean, international.",
    provider: "elevenlabs",
    providerVoiceKey: "EN_MALE_CLEAR_1",
    language: "en",
    gender: "male",
    toneTags: ["direct", "clean", "international"],
    status: "beta",
    visibility: "internal",
    supportsPreview: true,
    sortOrder: 60,
  },
];

export function getVisibleAvatars(forAudience: "customer" | "internal" = "customer") {
  return EFRO_AVATAR_CATALOG
    .filter((item) => item.status !== "hidden")
    .filter((item) => forAudience === "internal" || item.visibility !== "internal")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getVisibleVoices(
  language: EfroLanguage = DEFAULT_LANGUAGE,
  forAudience: "customer" | "internal" = "customer"
) {
  return EFRO_VOICE_CATALOG
    .filter((item) => item.status !== "hidden")
    .filter((item) => language === "mixed" || item.language === language)
    .filter((item) => forAudience === "internal" || item.visibility !== "internal")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAvatarById(avatarId?: string | null) {
  if (!avatarId) return null;
  return EFRO_AVATAR_CATALOG.find((item) => item.id === avatarId) || null;
}

export function getVoiceById(voiceId?: string | null) {
  if (!voiceId) return null;
  return EFRO_VOICE_CATALOG.find((item) => item.id === voiceId) || null;
}

export function createInitialShopSettings(shopDomain: string): ShopSettings {
  const settings = createDefaultShopSettings(shopDomain);
  const defaultAvatar = getVisibleAvatars("customer")[0] || null;
  const defaultVoice = getVisibleVoices(settings.selectedLanguage, "customer")[0] || null;

  return {
    ...settings,
    selectedAvatarId: defaultAvatar?.id || null,
    selectedVoiceId: defaultVoice?.id || null,
    updatedAt: new Date().toISOString(),
  };
}
