export const EFRO_PRODUCT_MODEL_VERSION = "2026-03-29";

export type EfroLanguage = "de" | "en" | "mixed";

export type AvatarStatus = "active" | "beta" | "hidden" | "deprecated";
export type VoiceStatus = "active" | "beta" | "hidden" | "deprecated";

export type CatalogVisibility = "customer" | "internal" | "premium";

export type AvatarProvider = "mascotbot" | "rive" | "custom_lipsync" | "other";
export type VoiceProvider = "elevenlabs" | "openai" | "custom" | "other";

export type OnboardingStep = "avatar" | "voice" | "language" | "review" | "done";

export type ShopFeatureFlag =
  | "avatar"
  | "voice"
  | "chat"
  | "product_recommendations"
  | "commerce_actions"
  | "catalog_optimization"
  | "watchdog"
  | "customer_dashboard";

export type QualityAreaStrength = {
  id: string;
  label: string;
  evidence: string;
  confidence: number;
};

export type QualityAreaWeakness = {
  id: string;
  label: string;
  problem: string;
  confidence: number;
  action: string;
};

export type TermTrainingNeed = {
  term: string;
  issue: "unknown_term" | "wrong_category" | "no_results" | "weak_match";
  count24h: number;
  suggestedAction: string;
};

export type IncidentType =
  | "sync_error"
  | "commerce_error"
  | "catalog_warning"
  | "quality_gap"
  | "config_change"
  | "release_change"
  | "operator_note";

export type IncidentSeverity = "info" | "warn" | "critical";

export type GoLiveVerdict = "not_ready" | "needs_work" | "pilot_ready" | "go_live_ready";

export type AvatarCatalogItem = {
  id: string;
  slug: string;
  label: string;
  description: string;
  rivFile: string;
  previewImageUrl?: string | null;
  tags: string[];
  languages: EfroLanguage[];
  provider: AvatarProvider;
  status: AvatarStatus;
  visibility: CatalogVisibility;
  supportsLipSync: boolean;
  supportsPreview: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type VoiceCatalogItem = {
  id: string;
  slug: string;
  label: string;
  description: string;
  provider: VoiceProvider;
  providerVoiceKey?: string | null;
  language: EfroLanguage;
  gender?: "female" | "male" | "neutral" | null;
  toneTags: string[];
  status: VoiceStatus;
  visibility: CatalogVisibility;
  supportsPreview: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ShopSettings = {
  shopDomain: string;
  selectedAvatarId?: string | null;
  selectedVoiceId?: string | null;
  selectedLanguage: EfroLanguage;
  onboardingCompleted: boolean;
  onboardingStep: OnboardingStep;
  avatarEnabled: boolean;
  voiceEnabled: boolean;
  chatEnabled: boolean;
  demoMode: boolean;
  featureFlags: ShopFeatureFlag[];
  updatedAt?: string;
};

export type ShopFingerprint = {
  shopDomain: string;
  plan: string;
  verticalHint?: string | null;
  catalogLanguage: EfroLanguage;
  productCount: number;
  hasAvatarConfigured: boolean;
  hasVoiceConfigured: boolean;
  hasCommerceSignals: boolean;
  catalogStatus: "unknown" | "weak" | "usable" | "strong";
  readinessBucket: GoLiveVerdict;
  lastAssessedAt?: string;
  notes: string[];
};

export type QualitySignals = {
  shopDomain: string;
  strengths: QualityAreaStrength[];
  weaknesses: QualityAreaWeakness[];
  productGroupStrengths: QualityAreaStrength[];
  productGroupWeaknesses: QualityAreaWeakness[];
  trainingNeeds: TermTrainingNeed[];
  noResultPatterns: string[];
  updatedAt?: string;
};

export type IncidentTimelineItem = {
  id: string;
  shopDomain: string;
  type: IncidentType;
  severity: IncidentSeverity;
  title: string;
  detail: string;
  createdAt: string;
  source?: string | null;
};

export type GoLiveReadiness = {
  shopDomain: string;
  score: number;
  verdict: GoLiveVerdict;
  blockers: string[];
  strengths: string[];
  nextActions: string[];
  updatedAt: string;
};

export type CustomerDashboardSnapshot = {
  shopDomain: string;
  selectedAvatarId?: string | null;
  selectedVoiceId?: string | null;
  selectedLanguage: EfroLanguage;
  onboardingCompleted: boolean;
  conversations24h: number;
  recommendations24h: number;
  commerceActions24h: number;
  noResults24h: number;
  latestActivityAt?: string | null;
  latestSuccessMessage?: string | null;
};

export type InternalShopReviewSnapshot = {
  shopDomain: string;
  healthScore: number;
  priorityScore: number;
  primaryFocus: string;
  nextAction: string;
  lastSyncAt?: string | null;
  lastChatAt?: string | null;
  commerceLastStatus?: string | null;
  duplicateCandidateCount: number;
};

export const DEFAULT_FEATURE_FLAGS: ShopFeatureFlag[] = [
  "avatar",
  "voice",
  "chat",
  "product_recommendations",
  "commerce_actions",
  "catalog_optimization",
  "watchdog",
  "customer_dashboard",
];

export const DEFAULT_ONBOARDING_STEP: OnboardingStep = "avatar";
export const DEFAULT_LANGUAGE: EfroLanguage = "de";

export function getGoLiveVerdict(score: number): GoLiveVerdict {
  if (score >= 85) return "go_live_ready";
  if (score >= 70) return "pilot_ready";
  if (score >= 50) return "needs_work";
  return "not_ready";
}

export function createDefaultShopSettings(shopDomain: string): ShopSettings {
  return {
    shopDomain,
    selectedAvatarId: null,
    selectedVoiceId: null,
    selectedLanguage: DEFAULT_LANGUAGE,
    onboardingCompleted: false,
    onboardingStep: DEFAULT_ONBOARDING_STEP,
    avatarEnabled: true,
    voiceEnabled: true,
    chatEnabled: true,
    demoMode: false,
    featureFlags: [...DEFAULT_FEATURE_FLAGS],
    updatedAt: new Date().toISOString(),
  };
}
