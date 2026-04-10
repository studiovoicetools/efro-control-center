#!/usr/bin/env bash
set -euo pipefail

echo '=== TYPECHECK ==='
npm run typecheck 2>/dev/null || npx tsc -p tsconfig.json --noEmit

echo
echo '=== BUILD ==='
npm run build

echo
echo '=== OPTIONAL LOCAL API SMOKE ==='
if ss -ltn | grep -q ':3010 '; then
  curl -fsS 'http://127.0.0.1:3010/api/ops/watchdog' >/dev/null || true
fi

echo
echo 'CI_SAFE_OK=1'
