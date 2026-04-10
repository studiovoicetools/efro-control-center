import { NextResponse } from "next/server";
import { getShopConfigSnapshot } from "@/lib/efro-shop-config";

type RuntimeAvatar = {
  id?: string | null;
  label?: string | null;
  description?: string | null;
  rivFile?: string | null;
  provider?: string | null;
  supportsLipSync?: boolean | null;
};

type RuntimeVoice = {
  id?: string | null;
  label?: string | null;
  description?: string | null;
  provider?: string | null;
  providerVoiceKey?: string | null;
  language?: string | null;
};

type RuntimeSettings = {
  selectedAvatarId?: string | null;
  selectedVoiceId?: string | null;
  selectedLanguage?: string | null;
  onboardingCompleted?: boolean | null;
  featureFlags?: string[] | null;
};

type ShopConfigSnapshotLike = {
  ok?: boolean;
  source?: string;
  settingsSource?: string;
  settings?: RuntimeSettings;
  selectedAvatar?: RuntimeAvatar | null;
  selectedVoice?: RuntimeVoice | null;
};

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

    const data = (await getShopConfigSnapshot(shopDomain)) as ShopConfigSnapshotLike;
    const settings = data.settings || {};
    const avatar = data.selectedAvatar || {};
    const voice = data.selectedVoice || {};

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      shopDomain,
      runtimeConfig: {
        language: settings.selectedLanguage || "de",
        onboardingCompleted: Boolean(settings.onboardingCompleted),
        avatar: {
          id: settings.selectedAvatarId || null,
          label: avatar.label || null,
          description: avatar.description || null,
          rivFile: avatar.rivFile || null,
          provider: avatar.provider || null,
          supportsLipSync: Boolean(avatar.supportsLipSync),
        },
        voice: {
          id: settings.selectedVoiceId || null,
          label: voice.label || null,
          description: voice.description || null,
          provider: voice.provider || null,
          providerVoiceKey: voice.providerVoiceKey || null,
          language: voice.language || null,
        },
        featureFlags: Array.isArray(settings.featureFlags) ? settings.featureFlags : [],
      },
      sources: {
        snapshotSource: data.source || "unknown",
        settingsSource: data.settingsSource || "unknown",
      },
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
