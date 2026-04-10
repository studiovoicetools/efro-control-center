# EFRO Verified Runtime Drifts and Optimization Plan

Stand: 2026-04-08

## Zweck
Dieses Dokument bündelt nur **direkt verifizierte** Drifts, Spannungen und Optimierungshebel aus den aktuell gelesenen Repos:
- `efro`
- `efro-brain`
- `efro-shopify`
- `efro-widget`

Es trennt bewusst zwischen:
- **direkt verifiziertem Ist-Zustand**
- **direkt verifizierten Drifts**
- **sinnvollen Optimierungsprioritäten**

Es soll verhindern, dass neue Agenten oder Operatoren wieder mit widersprüchlichen Architekturannahmen starten.

---

## 1. Direkt verifizierte Kernbefunde

### 1.1 `efro-widget`
Direkt verifiziert:
- `package.json` nennt das Repo weiterhin `elevenlabs-avatar`
- `README.md` beschreibt es als ElevenLabs/Mascotbot Avatar Demo
- aktiver Runtime-Code in `src/app/page.tsx` ist jedoch klar EFRO-spezifisch:
  - Starttext: `Ich bin EFRO, dein KI-Verkäufer`
  - Default `shopDomain`: `avatarsalespro-dev.myshopify.com`
  - Default `apiUrl`: `https://efro-brain.vercel.app`
  - Shopify-Produkt-URL-/Bild-Korrekturen
- `src/app/api/get-signed-url/route.ts` ist ebenfalls EFRO-spezifisch:
  - EFRO-Voice-Key-Mapping
  - ElevenLabs-Agent-Auflösung
  - MascotBot Signed-URL-Anfrage

### 1.2 `efro-brain`
Direkt verifiziert:
- `package.json` nennt das Repo `@efro/brain-api`
- `README.md` beschreibt es als `EFRO Brain API`
- `package.json` behauptet weiterhin `start: node server.js`
- eine aktive Root-`server.js` ist jedoch nicht vorhanden
- stattdessen existieren:
  - `server.js.bak`
  - `legacy_backup/server*.js`
- aktive Runtime-Pfade liegen real in `pages/api/*`

Direkt verifizierte aktive API-Dateien:
- `pages/api/brain/chat.ts`
- `pages/api/brain/chat-v2-shadow.ts`
- `pages/api/shopify/sync.ts`
- `pages/api/health.ts`
- `pages/api/tts-with-visemes.ts`
- `pages/api/gdpr/*`
- `pages/api/tool/search-products.ts`

### 1.3 `efro-shopify`
Direkt verifiziert:
- `package.json` nennt das Repo `@efro/shopify-app`
- `README.md` beschreibt OAuth, Product Sync, GDPR, Admin UI, Theme Extension
- `server.js` ist aktiv vorhanden und implementiert:
  - `/health`
  - `/`
  - `/api/session-token-check`
  - `/auth`
  - `/auth/callback`
  - App-/Produkt-/GDPR-Webhooks
- `web/shopify.js` enthält parallel zusätzlich einen Shopify-App-Express-/SQLite-Pfad

### 1.4 `efro`
Direkt verifiziert:
- `README.md` beschreibt `efro` eher als Gesamtprodukt-/Architektur-Repo
- `package.json` beschreibt es eher als `efro-landing`
- Repo ist deutlich dirty
- `.gitignore` enthält lokal den kaputten Eintrag `{console.log*`
- Worktree-/Parallel-Branch-Arbeitsweise ist direkt sichtbar und real nötig

---

## 2. Direkt verifizierte Architektur-Drifts

### Drift A — Widget Meta vs Runtime
Direkt verifiziert:
- Meta-Dateien von `efro-widget` wirken demo-/upstream-nah
- aktiver Runtime-Code ist EFRO-spezifisch

Konsequenz:
- Übergaben, Agenten und Operatoren können das Repo leicht falsch als reine Demo lesen
- reale Runtime-Verantwortung wird unterschätzt

### Drift B — Brain Meta vs Runtime
Direkt verifiziert:
- README + `package.json` sprechen noch von `server.js`
- aktive Runtime lebt tatsächlich unter `pages/api/*`
- `/api/cache/stats` wird in README behauptet, ist im aktiven `pages/api`-Bestand aber nicht sichtbar

Konsequenz:
- Meta-Doku und tatsächliche Runtime sind nicht deckungsgleich
- Operatoren prüfen leicht falsche Einstiegspunkte

### Drift C — Brain Standardpfad vs Shadowpfad
Direkt verifiziert:
- `pages/api/brain/chat.ts` ist aktiv
- `pages/api/brain/chat-v2-shadow.ts` ist aktiv
- `chat.ts` läuft über `runRetrieval(...)` und dort aktuell über `BrainOrchestrator`
- `chat-v2-shadow.ts` nutzt direkt `BrainV2Orchestrator`
- `efro-widget` ruft aktuell `${apiUrl}/api/brain/chat`
- `efro-widget` ruft aktuell **nicht** `${apiUrl}/api/brain/chat-v2-shadow`

Konsequenz:
- aktive Widget-Liveanfragen laufen aktuell sehr wahrscheinlich **nicht** über den BrainV2-Shadowpfad
- Shadow-Doku und Live-Pfad sind nicht identisch

### Drift D — Shopify doppelter App-/Webhook-Pfad
Direkt verifiziert:
- `server.js` implementiert eigenen OAuth-/Webhook-/Sync-Pfad
- `web/shopify.js` implementiert parallel einen zweiten Shopify-App-Express-/SQLite-Pfad

Konsequenz:
- zwei unterschiedliche App-/Auth-/Webhook-Wahrheiten im selben Repo
- erhöhtes Risiko für Fehlannahmen, falsche Deploy- oder Auth-Erwartungen

### Drift E — Shopify Full-Sync bei Produkt-Webhooks
Direkt verifiziert in `efro-shopify/server.js`:
- `products/create` → `syncProducts(...)`
- `products/update` → `syncProducts(...)`
- `products/delete` → `syncProducts(...)`
- `syncProducts(...)` zieht paginiert den kompletten Shopify-Katalog
- danach POST an `${BRAIN_API_URL}/api/shopify/sync`

Konsequenz:
- jeder einzelne Produkt-Webhook kann einen Vollsync triggern
- das ist der klarste direkt verifizierte Skalierungsdruckpunkt im Commerce-Pfad

### Drift F — Brain-URL-/Deploy-Drift
Direkt verifiziert:
- `efro-widget/src/app/page.tsx` Default `apiUrl`: `https://efro-brain.vercel.app`
- `efro-shopify/server.js` Default `BRAIN_API_URL`: `https://efro-brain.vercel.app`
- `efro-shopify/render.yaml` setzt jedoch `BRAIN_API_URL: https://efro-five.vercel.app`

Konsequenz:
- nicht eine einzige harte Brain-URL-Wahrheit im Bestand
- Cross-Service-Kommunikation kann je nach Umgebung auf verschiedene Brain-Ziele zeigen

### Drift G — `shops` vs `efro_shops`
Direkt verifiziert:
- `efro-shopify/server.js` liest/schreibt mit Fallback zwischen `shops` und `efro_shops`
- `efro-brain/pages/api/shopify/sync.ts` liest `shops` für `id, language`

Konsequenz:
- Shop-SSOT ist noch nicht final konsolidiert
- Sprache, UUID und Runtime-Annahmen hängen an parallelen Tabellenwahrheiten

---

## 3. Direkt verifizierte aktive Verträge zwischen den Repos

### 3.1 Widget → Brain
Direkt verifiziert in `efro-widget/src/app/page.tsx`:
- Textnachrichten gehen an `${apiUrl}/api/brain/chat`
- Payload: `{ message, shopDomain, sessionId }`
- Voice-Input wird über `useConversation` am Ende ebenfalls auf `sendMessage(...)` und damit auf `${apiUrl}/api/brain/chat` geleitet
- TTS geht an `${apiUrl}/api/tts-with-visemes`
- TTS-Payload enthält `shopDomain` und `shop_domain`

### 3.2 Brain → Supabase
Direkt verifiziert:
- `pages/api/brain/chat.ts` nutzt `cache_responses`, `events`, `conversations`
- `pages/api/tts-with-visemes.ts` nutzt `cache_audio`, `events`
- `pages/api/shopify/sync.ts` upsertet in `products`

### 3.3 Shopify → Brain
Direkt verifiziert:
- `efro-shopify/server.js` sendet Full-Sync-Produktdaten an `${BRAIN_API_URL}/api/shopify/sync`

---

## 4. Direkt verifizierte Optimierungshebel

## Priorität 1 — Brain-URL-SSOT festziehen
Warum:
- derzeit direkt verifizierter Drift zwischen `efro-brain.vercel.app` und `efro-five.vercel.app`
- Cross-Service-Kommunikation hängt an dieser Wahrheit

Direkt sinnvolle Optimierung:
- genau eine dokumentierte produktive Brain-URL festlegen
- alle Defaults und Deploy-Konfigurationen dagegen prüfen
- erst danach weitere Integrationsdiagnosen bewerten

## Priorität 2 — Live-Pfad vs Shadow-Pfad explizit markieren
Warum:
- Widget nutzt aktuell `/api/brain/chat`
- BrainV2-Shadow existiert parallel
- beide Pfade sind direkt verifiziert, aber nicht identisch

Direkt sinnvolle Optimierung:
- dokumentieren, welcher Pfad aktuell live ist
- dokumentieren, welcher Pfad nur Shadow/Eval ist
- keine impliziten Aussagen mehr wie „BrainV2 ist live“, solange Widget nicht auf Shadow zeigt

## Priorität 3 — Shopify-App-Doppelstruktur klären
Warum:
- `server.js` und `web/shopify.js` bilden zwei direkt verifizierte App-/Auth-/Webhook-Ansätze ab

Direkt sinnvolle Optimierung:
- dokumentieren, welcher Pfad produktiv maßgeblich ist
- den anderen Pfad klar als legacy/alt/park/noch-in-Bearbeitung markieren
- keine parallele Wahrheit im selben Repo ohne Kennzeichnung lassen

## Priorität 4 — Commerce Full-Sync-Risiko sichtbar machen
Warum:
- Produkt-Webhooks triggern direkt verifizierbar Vollsyncs
- das ist aktuell der klarste Skalierungshebel

Direkt sinnvolle Optimierung:
- zuerst Sichtbarkeit schaffen:
  - Sync-Häufigkeit
  - Dauer
  - Produktanzahl pro Sync
  - Fehlerquote
- erst dann Delta-Sync/Umbau planen

## Priorität 5 — Widget Meta-Dateien an Runtime-Wahrheit annähern
Warum:
- `efro-widget` wird meta-seitig weiterhin wie Demo gelesen
- aktiver Code ist längst EFRO-spezifisch

Direkt sinnvolle Optimierung:
- `package.json` / README an reale EFRO-Rolle annähern
- Upstream-/Demo-Herkunft dokumentieren, aber aktive Runtime sauber benennen

## Priorität 6 — Brain Meta-Dateien an aktive Next-API-Runtime annähern
Warum:
- `server.js` ist meta-seitig präsent, aber aktiv nicht sichtbar
- README-Endpunkt `/api/cache/stats` ist aktuell nicht als aktive Route sichtbar

Direkt sinnvolle Optimierung:
- README und Package-Meta an die reale `pages/api/*`-Struktur angleichen
- legacy/backup-Serverpfade als solche kennzeichnen

## Priorität 7 — Shop-Tabellen-SSOT klären
Warum:
- `shops` und `efro_shops` laufen weiter parallel im aktiven Codebestand

Direkt sinnvolle Optimierung:
- klar dokumentieren, welche Felder aus welcher Tabelle heute als maßgeblich gelten
- besonders: `shop_uuid`, `language`, `access_token`, `active/uninstalled`

---

## 5. Was aktuell **nicht** behauptet werden sollte

Auf Basis der direkt verifizierten Fakten sollte man aktuell **nicht** pauschal behaupten:
- dass BrainV2 bereits der tatsächliche Live-Standardpfad des Widgets ist
- dass `efro-shopify` nur eine einzige App-/Webhook-Wahrheit besitzt
- dass `efro-brain` meta- und runtime-seitig konsistent ist
- dass `efro-widget` bloß eine Demo ist
- dass eine einzige produktive Brain-URL im Bestand klar durchgezogen ist
- dass der Commerce-Sync schon als Delta-Sync oder final skalierungsfest gilt

---

## 6. Nächste direkt sinnvolle Arbeit

Die nächsten fachlich sinnvollen Schritte sind:
1. eine **produktive Brain-URL-SSOT** festlegen und gegen Widget/Shopify/Deploy prüfen
2. `chat.ts` vs `chat-v2-shadow.ts` als **live vs shadow** explizit dokumentieren
3. `efro-shopify` produktiven App-/Webhook-Pfad gegen `web/shopify.js` abgrenzen
4. Full-Sync-Sichtbarkeit in Shop-/Ops-Daten vorbereiten
5. README-/package-Meta in `efro-widget` und `efro-brain` näher an die reale Runtime bringen

---

## 7. Kurzfazit

Direkt verifiziert ist:
- EFRO hat bereits echte, aktive Runtime-Pfade in allen Kern-Repos
- der größte operative Schmerz kommt derzeit nicht von fehlender Substanz, sondern von **Drift zwischen Meta, Runtime und Cross-Service-Konfiguration**
- die sinnvollste Optimierung jetzt ist nicht blindes Neuimplementieren, sondern:
  - URL-/Pfad-SSOT
  - Live-vs-Shadow-Klarheit
  - Shopify-App-Wahrheit
  - Sichtbarkeit des Full-Sync-Risikos
