import { NextResponse } from "next/server";
import type {
  EfroLanguage,
  OnboardingStep,
  ShopFeatureFlag,
} from "@/lib/efro-product-model";
import { getShopConfigSnapshot } from "@/lib/efro-shop-config";
import { savePersistedShopSettings } from "@/lib/efro-shop-settings-store";

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

function isLanguage(value: unknown): value is EfroLanguage {
  return VALID_LANGUAGES.includes(value as EfroLanguage);
}

function isOnboardingStep(value: unknown): value is OnboardingStep {
  return VALID_ONBOARDING_STEPS.includes(value as OnboardingStep);
}

function isFeatureFlag(value: unknown): value is ShopFeatureFlag {
  return VALID_FEATURE_FLAGS.includes(value as ShopFeatureFlag);
}

export async function GET(
  _request: Request,
  { params }: { params: { shop: string } }
) {
  try {
    const shopDomain = decodeURIComponent(params.shop || "").trim();

    if (!shopDomain) {
      return NextResponse.json(
        { ok: false, error: "shop_domain_missing" },
        { status: 400 }
      );
    }

    const data = await getShopConfigSnapshot(shopDomain);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { shop: string } }
) {
  try {
    const shopDomain = decodeURIComponent(params.shop || "").trim();

    if (!shopDomain) {
      return NextResponse.json(
        { ok: false, error: "shop_domain_missing" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "invalid_json_body" },
        { status: 400 }
      );
    }

    const patch = {
      selectedAvatarId:
        typeof body.selectedAvatarId === "string" || body.selectedAvatarId === null
          ? body.selectedAvatarId
          : undefined,
      selectedVoiceId:
        typeof body.selectedVoiceId === "string" || body.selectedVoiceId === null
          ? body.selectedVoiceId
          : undefined,
      selectedLanguage: isLanguage(body.selectedLanguage)
        ? body.selectedLanguage
        : undefined,
      onboardingCompleted:
        typeof body.onboardingCompleted === "boolean"
          ? body.onboardingCompleted
          : undefined,
      onboardingStep: isOnboardingStep(body.onboardingStep)
        ? body.onboardingStep
        : undefined,
      avatarEnabled:
        typeof body.avatarEnabled === "boolean" ? body.avatarEnabled : undefined,
      voiceEnabled:
        typeof body.voiceEnabled === "boolean" ? body.voiceEnabled : undefined,
      chatEnabled:
        typeof body.chatEnabled === "boolean" ? body.chatEnabled : undefined,
      demoMode:
        typeof body.demoMode === "boolean" ? body.demoMode : undefined,
      featureFlags: Array.isArray(body.featureFlags)
        ? body.featureFlags.filter(isFeatureFlag)
        : undefined,
    };

    const result = await savePersistedShopSettings(shopDomain, patch);
    const snapshot = await getShopConfigSnapshot(shopDomain);

    return NextResponse.json({
      ok: result.ok,
      persisted: result.persisted,
      persistenceSource: result.source,
      warning: result.warning || null,
      shopDomain,
      snapshot,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 }
    );
  }
}
