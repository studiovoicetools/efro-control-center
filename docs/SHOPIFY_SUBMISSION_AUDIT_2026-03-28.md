# EFRO Shopify Submission Audit — 2026-03-28

## Verdict
EFRO is close, but not yet safe to submit with full confidence.

## Green / materially proven
- Widget has greeting, manual chat input, consent flow, and voice start button.
- Chat and tool share a versioned response cache.
- TTS route uses a versioned audio cache keyed by deploy/version + voice + language + text + model settings.
- Audio cache is live-proven MISS -> HIT.
- TV retrieval/ranking is materially improved and BAD demo products are demoted.
- Theme app extension exists in the Shopify repo.

## Submission blockers
1. Public-app GraphQL requirement
- New public apps submitted after April 1, 2025 must use GraphQL Admin API only.
- Current submit path still shows REST usage in efro-shopify:
  - server.js calls /admin/api/2024-10/products.json and /shop.json and /webhooks.json
  - web/shopify.js imports rest/admin/2024-10
- This is a blocker until the submission path is GraphQL-only.

2. Embedded-app session token / App Bridge proof
- embedded = true is configured in shopify.app.toml.
- However repo proof for latest App Bridge + session-token-secured backend path is not yet strong enough.
- Needs explicit review-safe proof.

3. Compliance webhooks / productive path mismatch
- shopify.app.toml points privacy compliance URLs to efro-brain /api/gdpr/*
- server.js also defines separate /webhooks/customers/* GDPR handlers
- one authoritative production path must exist and be fully HMAC-safe
- invalid HMAC on compliance webhook must return 401 Unauthorized

4. Storefront behavior mismatch with desired UX
- Desired live behavior: button first -> greeting -> product request -> chat + voice/lipsync
- Current theme extension asset efro.js injects the iframe immediately into document.body
- This is not yet the desired merchant/buyer flow and may need cleanup before review

5. Billing / submission assets / dashboard readiness
- web/shopify.js currently has billing disabled
- if submitting as paid app, billing is a blocker
- support email, privacy policy, screencast, test credentials, and protected customer data review status must be complete in Partner Dashboard

## What looks good enough to preserve
- Shared truth between chat/tool via shared cache
- Voice/TTS path with cached spoken replies
- Product ranking improvements (TV, snowboard, BAD demo demotion)
- Theme app extension foundation

## Next required steps before submit
1. Remove REST from the submission path and make Shopify-facing admin calls GraphQL-only.
2. Prove embedded App Bridge + session token flow on the real submit build.
3. Collapse GDPR/compliance handling onto one production path and verify HMAC behavior.
4. Change storefront launch flow to button-first instead of immediate iframe injection.
5. Complete submission assets and decide billing mode (free vs Shopify-managed/manual billing path).

## Freeze rule
Do not submit and do not freeze the submission branch until all five blocker groups above are green.
