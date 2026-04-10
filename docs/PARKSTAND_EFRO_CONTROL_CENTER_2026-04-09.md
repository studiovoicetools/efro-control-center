# Parkstand EFRO / Control Center – 2026-04-09

## Verifizierter Stand

### EFRO-Agent / Watchdog
- EFRO-Agent-Watchdog ist stabil angebunden.
- `summary_status` ist aktuell grün.
- `ok = true`.
- `degraded = false`.
- `public_health_consecutive_failures = 0`.
- Der Watchdog-Loop liefert einen stabilen Live-Primärstatus.

### Bereits erfolgreich umgestellt
Folgende Stellen lesen EFRO-Agent-LiveTruth bereits als Primärsignal:

1. **Admin / Dashboard**
   - sichtbare EFRO-Agent-Live-Status-Kachel
   - Verbindung, Summary-Status, letzter Lauf, Public-Health-Zähler

2. **Shop-Detail-Seite** (`/shops/[shop]`)
   - EFRO-Agent-Primärstatus sichtbar
   - Handoff nur noch als Historie/Triage-Link

3. **API `/api/ops/watchdog`**
   - liefert `efroAgent.summary`

4. **API `/api/ops/handoff`**
   - erweitert um:
     - `efroAgent`
     - `liveTruth`
     - `triage.liveSummaryStatus`
     - `debugPrompt` mit Live-Summary-Status

5. **API `/api/ops/shop/[shop]`**
   - erweitert um:
     - `targetContext`
     - `efroAgent`
     - `liveTruth`

6. **API `/api/ops/quality/[shop]`**
   - erweitert um:
     - `targetContext`
     - `efroAgent`
     - `liveTruth`

## Was fachlich noch offen ist

### Plattformneutralität
Technisch ist LiveTruth sauber eingebunden.
Fachlich ist die Semantik aber noch nicht vollständig neutral.

Weiterhin Shopify-/Shop-lastig sind z. B.:
- `shop`
- `shopDomain`
- `merchant`
- `productCount`
- katalog-/sync-zentrierte Formulierungen
- shop-spezifische Qualitäts- und Readiness-Texte

## Was bewusst noch nicht gemacht wurde
- keine harte Routenmigration von `shop` auf `target`
- keine aggressive Umbenennung existierender Felder
- keine neue Auto-Fix-Logik
- kein weiterer Umbau des Watchdog-Grundrahmens

## Warum das der richtige Parkstand ist
- laufende Kompatibilität bleibt erhalten
- Live-Wahrheit kommt jetzt aus dem EFRO-Agent-Watchdog
- Handoff ist nur noch Triage/Historie
- die technische Grundlage für eine plattformneutrale Entkopplung ist jetzt vorhanden

## Erster Schritt für morgen

### Fokus: Semantik neutralisieren, nicht Technik neu bauen

Nicht morgen wieder beim Watchdog anfangen.

Stattdessen:
1. **Wording in `quality`, `shop`, `handoff` neutralisieren**
2. **Legacy-Kompatibilität behalten**
3. **Shopify-Begriffe schrittweise in Target-Semantik überführen**

### Zielrichtung
- `shop` -> langfristig `target`
- `shopDomain` -> langfristig `targetIdentifier`
- `merchant` -> neutraler Runtime-/Target-Link
- `productCount` -> neutralere Inhalts-/Inventar-Basis
- Sync-/Katalog-/Produkt-Sprache dort entschärfen, wo EFRO auch normale Websites abdecken soll

## Empfohlene Reihenfolge für morgen
1. `/api/ops/quality/[shop]` sprachlich neutralisieren
2. `/api/ops/handoff` / `debugPrompt` neutralisieren
3. `/api/ops/overview` erst danach angleichen

## Nicht morgen tun
- nicht erneut den Watchdog-Grundrahmen umbauen
- keine harte Umbenennung ohne Kompatibilitätsstrategie
- keine plötzliche Shopify-Entfernung, die bestehende Consumer bricht

## Merksatz
**Live-Wahrheit = EFRO-Agent-Watchdog.**

**Nächster fachlicher Schritt = weg von Shopify-Semantik, hin zu plattformneutralen Targets – ohne die heutige Kompatibilität zu brechen.**
