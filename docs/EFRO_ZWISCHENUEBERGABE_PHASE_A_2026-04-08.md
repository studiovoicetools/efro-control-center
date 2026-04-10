# EFRO Zwischenübergabe — Phase A

Stand: 2026-04-08

## Zweck
Diese Zwischenübergabe hält den aktuellen professionellen Arbeitsstand fest, damit der nächste Chat oder die nächste Arbeitssitzung ohne erneute Wahrheitsfindung direkt sinnvoll weiterarbeiten kann.

Der Fokus dieser Übergabe ist:
- Phase-A-Ziel
- bereits vorhandene Worktrees / Branches / Commits
- was bewusst noch nicht gemacht wurde
- welcher nächste größere Schritt fachlich richtig ist

### Kurzer Übergabehinweis
Bitte zuerst diese MD vollständig lesen. Beim Weiterarbeiten den aktuellen Stand immer kurz mit angeben. Wenn etwas unklar ist oder Fragen offen sind, die Frage bitte direkt hier in den Chat schreiben.

---

## 1. Aktuelle Phase

### Phase A
**EFRO Core vs Shopify Adapter sichtbar machen**

Das bedeutet aktuell bewusst noch nicht:
- Shopify entfernen
- große Runtime-Umbauten
- Retrieval tief neu bauen
- Delta-Sync / Queue / Worker schon implementieren

Phase A bedeutet aktuell:
- Repo-Rollen klarziehen
- Doku-/Meta-Wahrheit an den verifizierten Stand annähern
- kleine technische Marker setzen, die Shopify als **Kompatibilitäts-Fallback / Adaptermodus** sichtbar machen

---

## 2. Direkt verifizierte Rollenlage

### `efro-shopify`
Klar Shopify-Adapter:
- OAuth
- Callback
- Webhooks
- Produkt-Sync
- Shopify App-/Theme-/Admin-Kontext

### `efro-brain`
Core-nahe Runtime mit Shopify-Resten:
- Chat
- TTS
- Retrieval
- aktive Shopify-Fallbacks / Sync-Pfad / Retrieval-Kopplung

### `efro-widget`
Core-nahes EFRO-Frontend mit Shopify-Resten:
- Avatar
- Voice
- Text-Chat
- Produktdarstellung
- Shopify-Embedding-/Default-/Produktidentitätsreste

### `efro`
Produkt-/Landing-/Meta-Schicht:
- Gesamtpositionierung
- Shopify-first, aber nicht zwingend Shopify-only Zielbild

---

## 3. Heute real geschaffte Worktree-Stände

## 3.1 `efro-brain`
Worktree:
- `wt-efro-brain-phase-a-core-boundary-20260408`

Branch:
- `parallel/efro-brain-phase-a-core-boundary-20260408`

Commits:
- `476bd86dafc6600aa03d8579bdc2e719894f5bb3`
  - `docs(brain): clarify core role versus shopify adapter boundary`
- `0c93ebf23bba16f59a3f6e95ec1d2d83386793d3`
  - `refactor(brain): mark shopify defaults as compatibility fallback`

Bedeutung:
- Meta-/Doku-Rolle bereinigt
- aktive Brain-Fallbacks sichtbar als Shopify-Kompatibilitäts-Fallback markiert
- kein Verhalten geändert
- Typecheck lief sauber durch

## 3.2 `efro-widget`
Worktree:
- `wt-efro-widget-phase-a-core-boundary-20260408`

Branch:
- `parallel/efro-widget-phase-a-core-boundary-20260408`

Commits:
- `e615718d5fe48d05b0afbf63dbb1981153c8a12b`
  - `docs(widget): clarify efro frontend role versus demo origin`
- `85d3ff8eed5d4a1ea83db269359f995aff78cc97`
  - `refactor(widget): mark shopify defaults as compatibility fallback`
- `653fedf0e418df5dbfbee06bde29e9f5859e2cd8`
  - `refactor(widget): add compatibility helpers for product identity`

Bedeutung:
- Meta-/Doku-Rolle bereinigt
- Shopify-Defaults sichtbar als Kompatibilitäts-Fallback markiert
- Shopify-Produktidentität in benannte Kompatibilitäts-Helper gekapselt
- kein Verhalten geändert
- Typecheck lief sauber durch

## 3.3 `efro`
Worktree:
- `wt-efro-phase-a-core-boundary-20260408`

Branch:
- `parallel/efro-phase-a-core-boundary-20260408`

Commit:
- `9e34a4672cde1f1ce29c61e0119120d56269db64`
  - `docs(efro): adjust product positioning wording`

Bedeutung:
- Gesamtpositionierung nicht mehr nur Shopify-only formuliert
- weiterhin Shopify-first, aber anschlussfähig an Core + Adapter-Zielbild

---

## 4. Separater offener Fixstand

### `efro-shopify` — efro-five entfernen
Branch:
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

Blocker:
- Remote-Push scheitert aktuell an GitHub-Remote-Rechten / `403 permission denied`
- das ist kein Inhaltsproblem, sondern ein Rechte-/Remoteproblem

---

## 5. Was bewusst noch nicht gemacht wurde

Nicht gemacht:
- keine echte Retrieval-Entkopplung von `shopify_product_id`, `shopify_variant_id`, `shopify_handle`
- keine Neutralisierung des Tenant-/Shop-Modells
- kein neutraler Ingest-Pfad
- kein Commerce-Adapter-Layer jenseits Shopify
- keine Queue-/Worker-/Delta-Sync-Härtung
- keine tiefe Runtime-Neuordnung

Bewusste Entscheidung:
- klein
- worktree-basiert
- reversibel
- ohne riskanten Big-Bang-Umbau

---

## 6. Was Phase A jetzt fachlich erreicht hat

Phase A ist nicht mehr nur Analyse.

Sichtbar erreicht wurde:
- Repo-Rollen sind klarer
- Meta-/Doku-Wahrheit ist angenähert
- erste technische Marker im aktiven Code sind gesetzt
- Shopify bleibt voll funktionsfähig, wird aber zunehmend als **Kompatibilitäts-/Adapterbereich** sichtbar statt als stiller Kernstandard

---

## 7. Nächster größerer fachlicher Schritt

Nach diesem Zwischenstand ist der nächste größere sinnvolle Schritt:

### Option A — Phase A bewusst abschließen
- die vorhandenen Phase-A-Branches/Commits konsolidiert prüfen
- entscheiden, welche davon später wohin promoted werden sollen
- danach Phase B vorbereiten

### Option B — Phase B vorbereiten
Sobald Phase A bewusst geparkt/freigegeben ist:
- Tenant-/Shop-Modell neutralisieren
- Produkt-/Katalogmodell vom Shopify-Datenmodell lösen
- später neutralen Ingest-Pfad vorbereiten

### Empfehlung
Die beste nächste Fachrichtung ist:

> Phase A als sauberen Zwischenstand behandeln und danach kontrolliert in Phase B wechseln.

---

## 8. Aktuelle Einschätzung

- Analyse / Wahrheit: ca. **91 %**
- Drifts identifiziert: ca. **95 %**
- Phase A meta-seitig: **gut umgesetzt**
- Phase A technisch: **sichtbar begonnen und substanziell markiert**
- Gesamt Richtung Core + Shopify-Adapter + neutraler Kanal: ca. **81 %**

---

## 9. Kurzfazit

Dieser Stand ist professionell übergabefähig, weil:
- Worktrees / Branches / Commits klar benannt sind
- die Phase-A-Ziele klar sind
- die Änderungen klein, nachvollziehbar und reversibel sind
- der nächste größere Schritt fachlich klar ist

Der richtige nächste Einstieg nach dieser Übergabe ist:

> Phase A bewusst als Zwischenstand akzeptieren, dann kontrolliert Phase B vorbereiten.