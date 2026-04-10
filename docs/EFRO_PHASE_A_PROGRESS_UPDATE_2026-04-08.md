# EFRO Phase A Progress Update

Stand: 2026-04-08

## Zweck
Diese Notiz ergänzt den bisherigen Parkstand um den zuletzt abgeschlossenen kleinen technischen Marker-Schritt in `efro-widget`.

---

## Neuer abgeschlossener Schritt

### Repo
- `efro-widget`

### Branch / Worktree
- `parallel/efro-widget-phase-a-core-boundary-20260408`
- `wt-efro-widget-phase-a-core-boundary-20260408`

### Neuer Commit
- `653fedf0e418df5dbfbee06bde29e9f5859e2cd8`
- `refactor(widget): add compatibility helpers for product identity`

### Inhalt
In `src/app/page.tsx` wurde die bisher direkt verteilte Shopify-Produktidentität in benannte Kompatibilitäts-Helper gezogen:
- `getCompatProductHandle(...)`
- `getCompatProductId(...)`
- `getCompatVariantId(...)`

Diese Helper werden nun in den relevanten UI-Stellen verwendet, insbesondere bei:
- Produkt-URL-Bildung
- Deduplizierung / Identitäts-Key-Bildung

### Wichtig
Dieser Schritt ist bewusst:
- klein
- worktree-basiert
- verhaltensneutral
- ohne Entfernen von Shopify-Funktionalität

Er macht die bestehende Shopify-Kopplung im Widget-Code als **Kompatibilitätsschicht** sichtbarer, statt sie verstreut als stillen Standard zu belassen.

---

## Technischer Zustand

### Typecheck
- `efro-widget` Worktree-Typecheck lief sauber durch

### Bedeutung für Phase A
Mit diesem Schritt ist Phase A jetzt nicht mehr nur:
- Repo-Rollenklärung
- Doku-/Meta-Klärung
- Default-Marker

sondern zusätzlich:
- sichtbare Kapselung eines Shopify-spezifischen Identitätsbereichs im aktiven Widget-Code

---

## Aktuelle Phase-A-Commits

### `efro-brain`
- `476bd86dafc6600aa03d8579bdc2e719894f5bb3`
  - docs(brain): clarify core role versus shopify adapter boundary
- `0c93ebf23bba16f59a3f6e95ec1d2d83386793d3`
  - refactor(brain): mark shopify defaults as compatibility fallback

### `efro-widget`
- `e615718d5fe48d05b0afbf63dbb1981153c8a12b`
  - docs(widget): clarify efro frontend role versus demo origin
- `85d3ff8eed5d4a1ea83db269359f995aff78cc97`
  - refactor(widget): mark shopify defaults as compatibility fallback
- `653fedf0e418df5dbfbee06bde29e9f5859e2cd8`
  - refactor(widget): add compatibility helpers for product identity

### `efro`
- `9e34a4672cde1f1ce29c61e0119120d56269db64`
  - docs(efro): adjust product positioning wording

---

## Einschätzung

- Analyse / Wahrheit: ca. 91 %
- Drifts identifiziert: ca. 95 %
- Phase A meta-seitig: gut
- Phase A technisch: sichtbar und sauber begonnen
- Gesamt Richtung Core + Shopify-Adapter + neutraler Kanal: ca. 81 %

---

## Nächster sinnvoller Schritt

Der nächste sinnvolle Schritt ist jetzt nicht mehr ein weiterer winziger Marker aus Gewohnheit, sondern eine **kompakte professionelle Zwischenübergabe**, die festhält:
- Phase-A-Ziel
- bereits vorhandene Worktrees / Branches / Commits
- was bewusst noch nicht gemacht wurde
- welcher nächste größere Schritt fachlich folgt
