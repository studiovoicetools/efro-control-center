# EFRO Server Audit & Roadmap

Stand: 2026-04-08

## Ziel dieses Dokuments
Dieses Dokument ist die verifizierte Arbeitsgrundlage fuer die naechsten EFRO-Schritte.
Es trennt bewusst zwischen:
- **verifiziert vorhanden**
- **dirty / inkonsistent / aufraeumbeduerftig**
- **noch live zu verifizieren**
- **konkreter Roadmap**

Dieses Dokument soll verhindern, dass neue Agenten oder Entwickler widerspruechliche Annahmen treffen oder bereits vorhandene Bausteine doppelt bauen.

---

## 1. Verifizierter Ist-Zustand

### 1.1 Repos / Serverstruktur
Verifiziert vorhanden:
- `efro` unter `/opt/efro-agent/repos/efro`
- `efro-shopify` unter `/opt/efro-agent/repos/efro-shopify`
- `efro-brain` unter `/opt/efro-agent/repos/efro-brain`
- `efro-widget` unter `/opt/efro-agent/repos/efro-widget`
- `efro-agent` unter `/opt/efro-agent`
- `efro-control-center` unter `/root/work/efro-control-center`
- `caddy` unter `/etc/caddy`
- `mcp-repo-reader` unter `/opt/mcp-repo-reader` (Pfad vorhanden, aber aktuell nicht als Git-Repo erkennbar)

### 1.2 Git-/Sauberkeitszustand
#### `efro`
Deutlich dirty:
- geaenderte Doku-Dateien
- geloeschte Alt-Doku-Dateien
- neue Doku-Dateien mit Handover-/Status-/Park-Charakter
- neue API-/Runtime-Dateien
- neues `package-lock.json`

#### `efro-shopify`
Dirty:
- `.env.example`
- `.gitignore`
- `extensions/efro-embed/assets/efro.js`
- `web/shopify.js`
- neues `package-lock.json`

#### `efro-brain`
Dirty / inkonsistent:
- geloeschtes `node_modules`
- untracked `shopify_variants.csv`
- sehr viele Stammdateien mit Patch-/Fix-/Test-/Backup-Charakter

#### `efro-widget`
Dirty:
- mehrere `.bak-*` Dateien in produktionsnahen Pfaden
- neues `scripts/smoke-preview-runtime-bridge.sh`

#### `efro-control-center`
Pfad vorhanden und Next.js-Projekt vorhanden, aber **aktuell kein Git-Repo**.

#### `efro-agent`
Leicht dirty:
- `elevenlabs-agents-list.json` untracked

### 1.3 Reverse Proxy / Ingress
Aktuell verifiziert in `/etc/caddy/Caddyfile`:
- `mcp.avatarsalespro.com -> 127.0.0.1:8010`

Nicht verifiziert ueber den lesbaren Caddy-Bestand:
- produktive Reverse-Proxies fuer `efro`, `efro-widget`, `efro-brain`, `efro-control-center`, `efro-shopify`

=> Aktueller lesbarer Caddy-Stand ist **minimal** und bildet die Gesamtplattform **nicht vollstaendig** ab.

### 1.4 Deployment-Ziele
Verifiziert:
- `efro` enthaelt `vercel.json`, `render.yaml`, `railway.json`, `Dockerfile`
- `efro-shopify` enthaelt `render.yaml` und `.vercel/`
- `efro-brain` enthaelt `.vercel/`
- `efro-widget` enthaelt `.vercel/`
- `efro-control-center` enthaelt `.vercel/`
- Docker wird laut Auftrag **nicht genutzt**

### 1.5 Control Center
Verifiziert im Bestand:
- Next.js-App auf Port 3010 (`dev`/`start` in `package.json`)
- reale Supabase-Anbindung
- reale Health-/Alert-/Kostenlogik in `lib/ops-data.ts`
- zentrale Doku vorhanden (`EFRO_CONTROL_CENTER_MASTER.md`, `ARCHITECTURE_OVERVIEW.md`, weitere)

Wichtige verifizierte Datenquellen im Control Center:
- `efro_shops`
- `products`
- `ops_events_daily_v1`
- `conversations`
- `ops_global_audio_cache_state_v1`
- `ops_shop_response_cache_state_v1`
- `efro_action_log`

Wichtige verifizierte Logik:
- stale sync > 12h
- inactive > 24h
- duplicate title detection
- cache hit rate alerts
- commerce last status alerts
- estimated TTS cost
- priority score / next action

Wichtige Einschraenkung:
- Fallback auf Mock-Daten ist im Code vorhanden
- fuer Produktion muss klar sichtbar sein, ob `source = supabase` oder `source = mock`

### 1.6 efro-agent / Watchdog
Verifiziert:
- FastAPI-Agent vorhanden
- liest Vercel, Render, Supabase und ElevenLabs via Read-APIs
- Chroma-/Embedding-/Prompt-Grundgeruest vorhanden
- Shell execution, package install, arbitrary file writes und mutierende API-Operationen sind absichtlich deaktiviert

=> Der Agent ist aktuell **diagnostisch/lesend**, nicht als vollautonomer Reparatur-/Deploy-Agent einzustufen.

### 1.7 efro-shopify
Verifiziert:
- OAuth vorhanden
- Shop-Speicherung in `shops` mit Fallback `efro_shops`
- Registrierung von Shopify-Webhooks vorhanden
- Produktsync vorhanden
- GDPR-Webhooks vorhanden

Wichtige verifizierte Schwachstelle:
- `products/create`, `products/update`, `products/delete` triggern jeweils `syncProducts(shop, accessToken)`
- `syncProducts` holt den kompletten Shopify-Katalog paginiert und sendet ihn an die Brain-API

=> Das ist fuer groessere Skalierung **kein finaler Delta-Sync**, sondern ein teurer Full-Sync-Ansatz.

### 1.8 efro-brain
Verifiziert:
- zentraler Brain-Service mit produktiven API-Pfaden
- Supabase-Anbindung fuer Retrieval, Cache, Events und Conversations
- Response-Cache vorhanden (`cache_responses`)
- Audio/TTS-Cache vorhanden (`cache_audio`)
- Session-/Conversation-Logging vorhanden
- BrainV2-/Memory-/Term-Memory-Bausteine vorhanden

Verifizierte Cache-Logik:
- `src/retrieval/responseCache.ts`
  - normalisierte Query
  - versionsierter Cache-Key (`BRAIN_CACHE_VERSION`)
  - TTL 6 Stunden
  - Tabelle `cache_responses`
- `pages/api/tts-with-visemes.ts`
  - Audio-Cache mit `cache_audio`
  - Cache-Hit / Cache-Miss Header
  - TTS-Events werden geloggt

Wichtige Einschraenkung:
- Repo enthaelt viele Patch-/Fix-/Backup-/Legacy-Dateien im Stamm
- mehrere historische und potenziell konkurrierende Implementierungen sind sichtbar
- damit ist der Brain-Bestand **funktional stark**, aber **strukturell nicht aufgeraeumt**

### 1.9 efro-widget
Verifiziert:
- dedizierter Widget-/Avatar-Client vorhanden
- MascotBot SDK Tarballs liegen im Repo
- Backup-Dateien in `src/app` vorhanden

### 1.10 efro Haupt-App
Verifiziert:
- Next.js-Haupt-App mit Supabase
- eigenes Schema in `supabase/schema.sql`
- mehrere Deploy-Ziele und Doku-Bestand

Wichtige Einschraenkung:
- Rolle von `efro` gegenueber `efro-widget` und `efro-control-center` ist architektonisch noch nicht final SSOT-klar

---

## 2. Verifizierte Supabase-Tabellen / Views / erwartete Datenquellen

### 2.1 Im `efro`-Schema verifiziert
- `shops`
- `products`
- `sessions`
- `gdpr_customer_requests`

### 2.2 Im `efro-brain`-Schema / Migrationen verifiziert
- `sessions` (reichhaltigere Brain-Variante mit `session_id`, `shop`, `user_id`, `preferences`, `history`, `last_interaction`, `total_interactions`)
- `conversations`
- laut Code / Migrationen / Doku ausserdem vorgesehen oder genutzt:
  - `cache_responses`
  - `cache_audio`
  - `events`
  - `brain_term_memory`
  - `brain_unknown_term_log`
  - `product_validation` (Migration vorhanden)

### 2.3 Im Control Center als Datenquellen verifiziert erwartet
- `efro_shops`
- `products`
- `conversations`
- `ops_events_daily_v1`
- `ops_global_audio_cache_state_v1`
- `ops_shop_response_cache_state_v1`
- `efro_action_log`

### 2.4 Wichtige Wahrheit
Aktuell gibt es **keine einzige offensichtliche, sauber dokumentierte und live-verifizierte SSOT-Liste aller produktiven Supabase-Tabellen/Views**.
Es gibt stattdessen:
- Basisschema im `efro`-Repo
- reichhaltigere Migrations im `efro-brain`
- erwartete Views im Control Center
- historische Doku/Handover-Files mit weiteren Tabellenhinweisen

=> **Supabase-SSOT muss vor groesseren Umbauten konsolidiert werden.**

---

## 3. Nicht verifiziert / noch live zu pruefen

Diese Punkte sind aus dem aktuell lesbaren Repo-Bestand noch **nicht final live verifiziert**:

1. Welche Supabase-Tabellen und Views existieren **heute wirklich** in Produktion?
2. Welche davon sind leer, historisch, veraltet oder aktiv beschrieben?
3. Welche Reverse-Proxies / Domains zeigen aktuell auf welche lokalen Dienste?
4. Welche Vercel-Deployments sind produktiv und welche nur historisch/staging?
5. Welcher Teil von `efro`, `efro-widget`, `efro-control-center` ist **die** produktive Haupt-UI?
6. Welche Cache-Tabellen/View-Aggregationen werden heute real befuellt?
7. Ob `ops_events_daily_v1`, `ops_global_audio_cache_state_v1`, `ops_shop_response_cache_state_v1` bereits live gepflegt werden
8. Ob alle ElevenLabs-/MascotBot-relevanten Fluesse pro Shop sauber gemessen werden
9. Ob der Shopify-Sync aktuell vollstaendig laeuft oder durch Dirty-State / Drift gefaehrdet ist
10. Ob das Control Center heute echte Daten oder haeufig Mock-Fallbacks zeigt

---

## 4. Harte Architektur-Feststellungen

### 4.1 EFRO ist derzeit **nicht** glaubwuerdig als „fertig fuer Millionen Shops“ verifiziert
Der lesbare Bestand zeigt:
- gute Bausteine fuer Cache, Memory, Logging, Retrieval und Monitoring
- aber auch Dirty-Repos, konkurrierende Doku-/Patch-Staende, fehlende SSOT-Grenzen und einen noch nicht sauberen Full-Sync-Ansatz in Shopify

=> Es gibt **Substanz**, aber keine belastbare Evidenz fuer „perfekt / fertig / Millionen-Shops-ready“.

### 4.2 Der staerkste bereits vorhandene Baustein ist das Control-Center-Denken
Das Control Center ist bereits auf:
- Shop-Health
- Cache-Raten
- TTS-Kosten
- Commerce-Status
- Priorisierung
- Alerts
- Ops-SSOT

konzipiert.

=> Die Roadmap soll diesen Baustein **nicht ersetzen**, sondern zur echten SSOT ausbauen.

### 4.3 Das aktuell groesste technische Skalierungsrisiko liegt im Commerce-/Sync-Pfad
Das verifizierte Problem ist:
- Produkt-Webhooks triggern Full-Sync
- kein verifizierter Delta-Sync
- kein verifizierter Queue-/Worker-Pfad als harte SSOT

=> Dieser Bereich ist ein Kernpunkt fuer Stabilitaet und Skalierung.

### 4.4 Das aktuell groesste organisatorische Risiko ist fehlende Wahrheitstrennung
Aktuell parallel sichtbar:
- `shops` und `efro_shops`
- `efro` und `efro-widget` und `efro-control-center` als teils ueberschneidende UI-/App-Schichten
- mehrere Doku-/Status-/Park-Dateien
- mehrere Brain-Implementierungs- / Patch-/Legacy-Pfade

=> Ohne SSOT-Disziplin werden neue Agenten fast zwangslaufig widerspruechliche Aussagen treffen.

---

## 5. Roadmap

## Phase 0 — Stop the drift / Arbeitsgrundlage fixieren
**Ziel:** Keine weitere Architektur-Drift.

### Aufgaben
1. **SSOT-Dokumente festlegen**
   - genau ein Master-Dokument fuer Architektur
   - genau ein Master-Dokument fuer produktive Domains/Deployments
   - genau ein Master-Dokument fuer Supabase-SSOT
2. **Dirty-Inventur pro Repo**
   - `keep / archive / delete / merge` fuer jede untracked/bak/status-Datei
3. **Doku-Parkzone definieren**
   - operative Alt-/Handover-Dokus aus Produktiv-Sicht trennen
4. **Control Center Git-Status bereinigen**
   - `efro-control-center` in sauberen Git-Zustand bringen
5. **Produktive Rollen festlegen**
   - `efro` = ?
   - `efro-widget` = ?
   - `efro-control-center` = ?

### Ergebnis
- keine widerspruechlichen Wahrheiten mehr
- sauberer Startpunkt fuer alle weiteren Arbeiten

## Phase 1 — Produktionsinventur verifizieren
**Ziel:** Live verifizieren, was wirklich existiert und genutzt wird.

### Aufgaben
1. **Supabase Live Audit**
   - komplette Liste aller Tabellen
   - komplette Liste aller Views
   - je Objekt: Zweck, Quelle, Schreiber, Leser, Aktivitaet
2. **Deployment-/Domain-Audit**
   - Vercel-Projekte
   - Render-Services
   - produktive Domains
   - lokale Ports / Reverse-Proxy-Ziele
3. **Secrets-/ENV-Audit**
   - je Repo alle benoetigten produktiven ENV-Variablen
   - Scope / owner / public vs server-only
4. **Cache-Live-Audit**
   - `cache_responses` live vorhanden?
   - `cache_audio` live vorhanden?
   - werden Hit-Counts und Updated-At sauber geschrieben?
   - werden Control-Center-Views wirklich befuellt?
5. **Control-Center-Live-Source-Audit**
   - welche Ansichten laufen mit `source = supabase`
   - wo gibt es Fallback auf `mock`

### Ergebnis
- echte produktive Bestandskarte
- verifizierte Tabellen-/View-Liste
- verifizierte Deployment-Landkarte

## Phase 2 — Cleanup & Strukturhygiene
**Ziel:** Unordnung abbauen, ohne Funktion zu verlieren.

### Aufgaben
1. **`efro-brain` Stamm aufraeumen**
   - Patch-/Fix-/Backup-Dateien klassifizieren
   - Legacy in klaren Archivbereich verschieben oder dokumentiert entfernen
2. **`efro-widget` Backups bereinigen**
   - `.bak-*` aus produktionsnahen Pfaden entfernen oder archivieren
3. **`efro` Doku-/Park-/Status-Dateien bereinigen**
   - nur noch relevante SSOT-Dokus prominent halten
4. **`efro-shopify` Dirty-Stand sauber auswerten**
   - `efro.js`, `web/shopify.js`, `.env.example`, `package-lock.json`
5. **Git-Hygiene-Regeln dokumentieren**
   - keine `.bak-*` im Produktivpfad
   - keine temporären Status-Dateien unkontrolliert im Haupt-Repo

### Ergebnis
- besser wartbare Codebasis
- geringeres Risiko fuer Agenten-/Entwickler-Irrtuemer

## Phase 3 — Supabase SSOT konsolidieren
**Ziel:** Ein klares Datenmodell fuer Produktion.

### Aufgaben
1. **Masterliste produktiver Tabellen/Views erstellen**
2. **`shops` vs `efro_shops` final entscheiden**
3. **Session-/Conversation-Wahrheit entscheiden**
   - welche Session-Definition ist produktiv?
4. **Ops-/Cache-/Voice-Views dokumentieren**
5. **Nicht genutzte / historische Tabellen markieren**

### Ergebnis
- eindeutige Datenbank-SSOT
- keine parallelen Wahrheiten mehr

## Phase 4 — Stabilitaet des Live-Flows absichern
**Ziel:** EFRO fuer reale Shops robust machen.

### Aufgaben
1. **Shopify Sync Flow absichern**
   - Full-Sync-Verhalten dokumentieren
   - Fehlerbilder dokumentieren
   - Sync-Zeit / Sync-Last / Retry-Risiken messen
2. **Brain Cache und TTS Cache verifizieren**
   - echte Hit-Rates messen
   - Invalidation-/Versionierungsstrategie dokumentieren
3. **Control Center live scharf schalten**
   - mock fallback klar kennzeichnen
   - fehlende Datenquellen schliessen
4. **End-to-End Messkette pro Shop etablieren**
   - install
   - sync
   - widget session
   - brain reply
   - tts request
   - commerce action

### Ergebnis
- pro Shop sichtbarer Betriebszustand
- kein Blindflug mehr

## Phase 5 — Monitoring / Kontrollsystem ausbauen
**Ziel:** Das von dir gewuenschte Ueberwachungs- und Steuersystem fertig machen.

### Aufgaben
1. **Einheitliches Event-Modell produktiv machen**
2. **Health Score verifizieren und justieren**
3. **Kostenmodell pro Shop vervollstaendigen**
   - Brain
   - TTS / ElevenLabs
   - MascotBot
4. **Alerting ausbauen**
   - stale sync
   - no products
   - no cache hits
   - repeated tts errors
   - repeated brain errors
   - commerce degradation
5. **Agent als Diagnostics-Ops-Layer integrieren**
   - lesend / auditierend / priorisierend

### Ergebnis
- operatives Kontrollsystem
- priorisierte Reparatur- und Optimierungsreihenfolge

## Phase 6 — Skalierungsumbau
**Ziel:** Architektur fuer viele Shops stabil machen.

### Aufgaben
1. **Shopify Delta-Sync statt Full-Sync**
2. **Queue-/Worker-SSOT definieren**
3. **asynchrone Verarbeitung fuer schwere Fluesse**
4. **Commerce-/Brain-/Widget-Grenzen finalisieren**
5. **Ops-Views und Aggregationen fuer hohe Last absichern**

### Ergebnis
- echte Skalierungsfaehigkeit
- weniger unnötige Last
- stabilere Shop-Updates

---

## 6. Konkrete Prioritaet fuer den naechsten Arbeitsblock

### Sofort als naechste 5 Schritte empfohlen
1. **Supabase Live Audit komplettieren**
   - alle echten Tabellen und Views dokumentieren
2. **Caddy / produktive Domains / lokale Zielports verifizieren**
3. **Control Center: source=mock vs source=supabase transparent machen**
4. **Dirty-Datei-Inventur in allen vier Kern-Repos aufstellen**
5. **`shops` / `efro_shops` / Session-SSOT Entscheidung vorbereiten**

---

## 7. Arbeitsprinzip ab jetzt

Ab jetzt gilt fuer weitere EFRO-Arbeit:
1. Nichts doppelt bauen, bevor der verifizierte Bestand geprueft ist
2. Keine pauschalen Skalierungsversprechen ohne Code-/DB-/Runtime-Evidenz
3. Erst SSOT und Bestandswahrheit, dann Umbau
4. Erst Sichtbarkeit und Stabilitaet, dann Skalierung
5. Das Control Center wird zur operativen Hauptwahrheit ausgebaut, nicht durch neue Parallelstrukturen ersetzt

---

## 8. Klare Antwort auf die Leitfrage

### Was schlage ich vor?
Ich schlage **keinen sofortigen wilden Neubau** vor.
Ich schlage vor:

1. **Bestand fixieren**
2. **Live-Wahrheit verifizieren**
3. **Dirty-/Altlasten kontrolliert bereinigen**
4. **Control Center als SSOT scharf machen**
5. **danach gezielt Shopify-Sync, Cache-Transparenz und Ops-Datenfluss haerten**

Das ist der schnellste Weg zu einem EFRO, das nicht nur beeindruckend aussieht, sondern **stabil, nachvollziehbar und wirklich betreibbar** wird.
