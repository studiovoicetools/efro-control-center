# EFRO Parkstand — Phase A

Stand: 2026-04-08

## Zweck
Dieses Dokument markiert einen sauberen Parkstand, damit die Arbeit morgen ohne erneute Wahrheitsfindung fortgesetzt werden kann.

Es hält fest:
- wo wir in Phase A stehen
- welche Worktrees / Branches / Commits bereits existieren
- was bewusst **noch nicht** gemacht wurde
- was der nächste fachlich richtige Einstiegspunkt ist

---

## 1. Gesamtlage

### Phase
Wir befinden uns in **Phase A**:

> EFRO Core vs Shopify Adapter sichtbar machen

### Ziel von Phase A
Nicht sofort tief umbauen, sondern zuerst:
- Repo-Rollen klarziehen
- Meta-/Doku-Wahrheit an den verifizierten Stand annähern
- erste technische Marker setzen, die Shopify als **Kompatibilitäts-Fallback / Adaptermodus** sichtbar machen

### Was Phase A ausdrücklich noch nicht ist
- keine vollständige Plattformneutralisierung
- kein Delta-Sync-Umbau
- kein großes Retrieval-Refactoring
- kein Entfernen von Shopify-Funktionalität

---

## 2. Was heute real geschafft wurde

## 2.1 Meta-/Doku-Phase-A-Schritte

### `efro-brain`
Branch / Worktree:
- `parallel/efro-brain-phase-a-core-boundary-20260408`
- `wt-efro-brain-phase-a-core-boundary-20260408`

Meta-Commit:
- `476bd86dafc6600aa03d8579bdc2e719894f5bb3`
- `docs(brain): clarify core role versus shopify adapter boundary`

Inhalt:
- README nicht mehr nur als Shopify-only Brain formuliert
- package.json-Beschreibung an Core-nahe Rolle angenähert

### `efro-widget`
Branch / Worktree:
- `parallel/efro-widget-phase-a-core-boundary-20260408`
- `wt-efro-widget-phase-a-core-boundary-20260408`

Meta-Commit:
- `e615718d5fe48d05b0afbf63dbb1981153c8a12b`
- `docs(widget): clarify efro frontend role versus demo origin`

Inhalt:
- README nicht mehr nur Demo/upstream-geprägt
- package.json-Beschreibung an EFRO-Frontend-Rolle angenähert

### `efro`
Branch / Worktree:
- `parallel/efro-phase-a-core-boundary-20260408`
- `wt-efro-phase-a-core-boundary-20260408`

Meta-Commit:
- `9e34a4672cde1f1ce29c61e0119120d56269db64`
- `docs(efro): adjust product positioning wording`

Inhalt:
- README nicht mehr nur Shopify-only positioniert
- package.json-Beschreibung an EFRO Core + starker Shopify-Adapter angenähert

---

## 2.2 Erste technische Marker-Schritte

### `efro-widget`
Branch / Worktree:
- `parallel/efro-widget-phase-a-core-boundary-20260408`
- `wt-efro-widget-phase-a-core-boundary-20260408`

Technischer Commit:
- `85d3ff8eed5d4a1ea83db269359f995aff78cc97`
- `refactor(widget): mark shopify defaults as compatibility fallback`

Inhalt:
- Shopify-Defaults wurden **nicht entfernt**, aber im Code sichtbar als Kompatibilitäts-Fallback / Modus markiert
- neue explizite Marker eingeführt, u. a.:
  - `SHOPIFY_COMPAT_DEFAULT_SHOP_DOMAIN`
  - `SHOPIFY_ADMIN_HOST`
- direkte harte Literale ersetzt, ohne Verhalten zu ändern

### `efro-brain`
Branch / Worktree:
- `parallel/efro-brain-phase-a-core-boundary-20260408`
- `wt-efro-brain-phase-a-core-boundary-20260408`

Technischer Commit:
- `0c93ebf23bba16f59a3f6e95ec1d2d83386793d3`
- `refactor(brain): mark shopify defaults as compatibility fallback`

Inhalt:
- aktive Brain-Fallbacks wurden **nicht entfernt**, aber sichtbar als Shopify-Kompatibilitäts-Fallback markiert in:
  - `pages/api/brain/chat.ts`
  - `pages/api/brain/chat-v2-shadow.ts`
  - `pages/api/tool/search-products.ts`
- Typecheck im `efro-brain`-Worktree lief sauber durch

---

## 3. Zusätzlicher separater Fixstand

### `efro-shopify` — efro-five entfernen
Es existiert bereits ein inhaltlich fertiger Fix:

Branch / Worktree-Stand:
- `parallel/efro-shopify-remove-efro-five-final-20260408`

Commit:
- `ce99f39ff0c4399082092e477571f80d41de75f2`
- `chore(shopify): remove efro-five brain target everywhere`

Inhalt:
- `efro-five.vercel.app` wurde im Fix-Commit ersetzt durch `https://efro-brain.vercel.app`
- betroffene Dateien:
  - `render.yaml`
  - `README.md`
  - `webhooks.js`
  - `web/frontend/utils/constants.js`

Wichtiger Blocker:
- Remote-Push scheitert aktuell **nicht am Inhalt**, sondern an GitHub-Remote-Rechten / `403 permission denied`

---

## 4. Was bewusst noch nicht gemacht wurde

### Noch nicht gemacht
- keine echte Retrieval-Entkopplung von `shopify_product_id`, `shopify_variant_id`, `shopify_handle`
- keine Neutralisierung des Tenant-/Shop-Modells
- kein neuer neutraler Ingest-Pfad
- kein Commerce-Adapter-Layer jenseits Shopify
- keine Queue-/Worker-/Delta-Sync-Härtung
- keine tiefe Runtime- oder Deploy-Neuordnung

### Bewusste Designentscheidung
Der aktuelle Ansatz war absichtlich:
- klein
- worktree-basiert
- reversibel
- ohne riskanten Big-Bang-Umbau

---

## 5. Was der nächste fachlich richtige Schritt ist

## Option A — Phase A sauber abrunden
Das ist aktuell der sinnvollste nächste Einstieg.

Nächster Fokus:
- noch einen kleinen, klaren Marker-Schritt im `efro-widget` oder `efro-brain` setzen
- danach professionelle Zwischenübergabe erstellen

Konkrete Kandidaten:
1. `efro-widget`
   - Shopify-Produktidentitätsfelder (`shopify_handle`, `shopify_product_id`, `shopify_variant_id`) sichtbar als Kompatibilitätsschicht markieren
2. `efro-brain`
   - Retrieval-Kopplung nicht umbauen, aber stärker als Shopify-Kompatibilitätsschicht dokumentieren / markieren

## Option B — Phase-B-Vorbereitung
Erst sinnvoll, wenn Phase A bewusst geparkt / zusammengefasst wurde.

Dann:
- Tenant-/Shop-Modell neutralisieren
- Produkt-/Katalogmodell entkoppeln

---

## 6. Empfohlener Wiedereinstieg morgen

Der fachlich beste Wiedereinstieg ist:

1. dieses Parkstand-Dokument lesen
2. die vorhandenen Phase-A-Branches nicht verwechseln
3. im `efro-widget`-Worktree weitermachen
   - dort ist der erste technische Marker bereits gesetzt
   - nächster kleiner Schritt: Shopify-Produktidentitätsfelder als Kompatibilitätsschicht sichtbarer machen
4. danach Phase A bewusst zusammenfassen und erst dann professionelle Zwischenübergabe erzeugen

---

## 7. Aktuelle Einschätzung

- Analyse / Wahrheit: ca. **91 %**
- Drifts identifiziert: ca. **95 %**
- Phase A meta-seitig: **gut umgesetzt**
- Phase A technisch: **begonnen und sichtbar**
- Gesamt Richtung Core + Shopify-Adapter + neutraler Kanal: ca. **80 %**

---

## 8. Kurzfazit

Der aktuelle Stand ist gut parkbar, weil:
- die Phase-A-Richtung klar ist
- mehrere kleine, saubere Worktree-Commits bereits existieren
- keine unkontrollierten großen Umbauten gemacht wurden
- der nächste sinnvolle Schritt fachlich klar ist

Morgen sollte **nicht** wieder bei der Wahrheitsfindung begonnen werden.
Der richtige Wiedereinstieg ist:

> Phase A mit einem letzten kleinen technischen Marker-Schritt abrunden, dann professionelle Zwischenübergabe erstellen.
