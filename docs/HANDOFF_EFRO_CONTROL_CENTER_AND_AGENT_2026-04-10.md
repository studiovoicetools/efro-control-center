# EFRO Übergabe – Control Center & EFRO-Agent

Stand: 2026-04-10 (konsolidiert auf aktuellen Arbeitsstand)

## 1. Zweck dieser Übergabe

Diese Übergabe soll einen Nachfolger in die Lage versetzen, ohne Rekonstruktion des gesamten Chats weiterzuarbeiten.

Sie beschreibt:
- das aktuelle Zielbild,
- den heute tatsächlich erreichten Stand,
- was als operative Wahrheit gilt,
- welche Punkte bereits geschlossen sind,
- und welche nächste Phase noch offen bleibt.

## 2. Aktuelle Systemrollen

### EFRO-Agent
- liefert den technischen Live-Zustand
- Watchdog-/Summary-Daten sind die primäre operative Wahrheit
- liefert insbesondere `summary_status`, `ok`, `degraded`, Public-Health-Zähler und Loop-Zustand

### EFRO Control Center
- liest und operationalisiert diese Live-Wahrheit
- visualisiert Qualität, Handoffs, Detailansichten, Triage und Admin-Sicht
- ist Diagnose-/Operator-Schicht, nicht die primäre Runtime-Wahrheit selbst

## 3. Was heute als wahr gelten soll

### Operative Wahrheit
- **primäre Live-Wahrheit = EFRO-Agent `/api/watchdog/summary`**
- **Handoffs = Triage / Historie**
- das Control Center soll primär auf den Live-Zustand des EFRO-Agenten reagieren

### Übergangssemantik
Es gilt weiterhin eine Übergangssemantik, die bestehende Konsumenten nicht abrupt bricht:
- `canonicalType = target`
- `legacyRouteType = shop`

Diese Brücke ist bewusst gewählt.

## 4. Was inzwischen erreicht ist

### 4.1 `quality.targetContext` ist verifiziert geschlossen
Der früher offene Punkt zu `quality.targetContext` ist nicht mehr offen.

Verifiziert ist:
- `ok = true`
- `liveTruth.summaryStatus = green`
- `targetContext.canonicalType = target`
- `targetContext.legacyRouteType = shop`
- `targetContext.identifier = avatarsalespro.myshopify.com`
- `targetContext.platformAgnostic = true`

### 4.2 Live-Truth / Agent-Anbindung steht
Relevante Control-Center-Pfade lesen heute Agent-/Live-Truth-Daten.

Dazu gehören insbesondere:
- Handoff-/Triage-Sicht
- Quality-Sicht
- Detail-/Ops-Sichten
- Admin-/Operator-Sicht

### 4.3 `nextAction` ist operativ besser priorisiert
Die frühere Priorisierungsinkonsistenz wurde bereinigt.

Commerce-/Aktionsfehler werden nicht mehr von stale-sync-Fällen überdeckt, wenn sie operativ dringlicher sind.

### 4.4 Sichtbare Restharmonisierung ist weit fortgeschritten
Die sichtbare UI wurde deutlich bereinigt.

Beispiele:
- `Shops` → `Ziele`
- `Produkte` → `Inhalte`
- `Merchant` / `Merchant-Dashboard` → `Dashboard`
- `Shop-Detail öffnen` → `Ziel-Detail öffnen`
- `Response Cache` → `Antwort-Cache`
- `Readiness Score` → `Bereitschaftsgrad`
- `Evidence öffnen` → `Nachweise öffnen`
- `Mock-Fallback` → `Fallback-Daten`
- `Alert` / `unknown` / `Hits` → `Hinweis` / `unbekannt` / `Treffer`

## 5. Wichtigste aktuelle Commits im `efro-control-center`

- `595b050` — Harmonize visible shop and merchant UI language
- `00dfb15` — Harmonize visible shop detail KPI language
- `24ba230` — Harmonize overview, onboarding, and internal quality visible language
- `1804792` — Harmonize admin visible language
- `cf07f3a` — Polish admin visible operator language
- `05b31c9` — Finalize admin visible operator wording
- `c0326c7` — Harmonize remaining visible mixed-language UI text

## 6. Maßgeblicher aktueller Arbeitsstand

Bester aktueller Branch für spätere Main-Promotion:
- `parallel/control-center-polish-20260410-closing-visible-rests`

Relevanter Abschluss-Commit:
- `c0326c7` — `Harmonize remaining visible mixed-language UI text`

Ein nachgelagerter Schluss-Check ergab:
- kein weiterer sinnvoller sichtbarer Restblock
- Typecheck grün

## 7. Was noch offen bleibt

### 7.1 Nicht mehr als UI-Polish, sondern als nächste Phase
Noch nicht vollständig gelöst sind:
- interne Feldnamen wie `shopDomain`, `productCount`
- historische Routen wie `/shops/...`, `/merchant/...`, `/api/ops/shop-config/...`
- tieferliegende Datenmodell-/API-Semantik

Das ist **nicht** mehr primär Text-Polish, sondern die nächste strukturelle Phase.

### 7.2 Plattform-Agnostik nur teilweise erreicht
Sichtbar/sprachlich ist das Control Center deutlich weniger Shopify-zentriert.

Intern ist es jedoch noch nicht vollständig plattformagnostisch.

## 8. Was ausdrücklich nicht mehr als offen gelten soll

Die folgenden früher offenen Punkte gelten heute nicht mehr als Hauptblocker:
- `quality.targetContext` verifizieren
- sichtbare grobe Restharmonisierung in Quality/Watchdog
- grundlegende `nextAction`-Priorisierungsfrage

## 9. Empfohlener nächster Schritt

Es gibt zwei saubere Optionen:

### Option A – diesen Arbeitsblock abschließen
- `parallel/control-center-polish-20260410-closing-visible-rests` reviewen und mergen
- danach `main` aktualisieren
- kurzer Sicht-/Smoke-Check

### Option B – neue Phase bewusst starten
Wenn die Arbeit **nicht** mit UI-Polish enden soll, dann als neue Phase:

**„target-first / plattformagnostische Kompatibilität im efro-control-center“**

Empfohlene Reihenfolge:
1. Kompatibilitäts-Mapping statt harter Breaking-Renames
2. `target`/`identifier`/`content` als bevorzugte Darstellungsebene
3. historische `shop*`-Strukturen nur noch als Kompatibilität mitführen
4. erst später tiefer in API-/Datenmodell-Strukturen gehen

## 10. Kurzfazit

Für den Zweck **Control-Center-Harmonisierung und Agent-Anbindung** ist der kritische Teil abgeschlossen.

Der aktuelle Stand ist:
- operativ konsistent,
- live-truth-basiert,
- sichtbar deutlich harmonisierter,
- aber intern noch nicht vollständig plattformagnostisch.
