# EFRO Übergabe – Control Center & EFRO-Agent

Stand: 2026-04-10

## 1. Zweck dieser Übergabe

Diese Übergabe soll einen Nachfolger in die Lage versetzen, **ohne erneute Kontextsuche** weiterzuarbeiten.

Sie dokumentiert:
- was **EFRO** ist,
- was die **Vision** ist,
- welche **Systemgrenzen** in diesem Chat galten,
- was in diesem Chat **tatsächlich erreicht** wurde,
- welche Punkte **noch offen** sind,
- welche **bekannten Stolpersteine** existieren,
- und was als **nächster sinnvoller Schritt** zu tun ist.

---

## 2. Was EFRO ist

EFRO ist hier **nicht** nur ein Shopify-Chatbot, sondern die Grundlage für ein **plattformübergreifendes Assistenz-/Analyse-/Operationssystem**.

Praktisch heißt das:
- EFRO soll **Shopify-Shops** unterstützen,
- aber perspektivisch **auch normale Websites / nicht-Shopify-Ziele**,
- und dabei sowohl in der **Laufzeit** als auch im **Operations-/Control-Center** verwertbare Zustände und Diagnosen liefern.

In diesem Chat war EFRO bereits so zu behandeln, dass:
- die technische Realität heute noch teilweise **shop-/shopify-lastig** ist,
- die fachliche Richtung aber **plattformneutral / target-zentriert** sein soll.

---

## 3. Zielbild / Vision

### 3.1 Zielarchitektur

Es gibt hier funktional zwei Hauptrollen:

1. **EFRO-Agent**
   - liefert den **Live-Zustand / Watchdog / technische Wahrheit**
   - aktuell read-only, kein Auto-Fix
   - ist die operative Live-Quelle für `summary_status`, `ok`, `degraded`, Public-Health usw.

2. **Control Center**
   - visualisiert, aggregiert und operationalisiert Zustände
   - stellt API-Antworten und UI-Ansichten für Diagnose, Handoff, Quality und Detailseiten bereit
   - soll **nicht** mehr auf alte Handoffs als Live-Wahrheit bauen, sondern auf den EFRO-Agent-Livezustand

### 3.2 Fachliche Zielrichtung

Die strategische Richtung ist:
- weg von **rein Shopify-/Shop-Semantik**,
- hin zu **plattformneutralen Targets**,
- ohne die heute noch existierende Kompatibilität sofort zu brechen.

Also:
- nicht abrupt `shop` entfernen,
- sondern kontrolliert mit Übergangssemantik arbeiten:
  - `targetContext`
  - `liveTruth`
  - `canonicalType = target`
  - `legacyRouteType = shop`

---

## 4. Harte Systemgrenzen dieses Chats

Wichtig: In diesem Chat sollte **nicht** an allen Repos gearbeitet werden.

Explizite Grenze:
- **nur `efro-control-center`**
- plus der **bestehende EFRO-Agent-Vertrag** / EFRO-Agent-Livezustand
- **keine Änderungen an anderen Repos** wie `efro`, `efro-shopify`, `efro-brain`, `efro-widget` usw.

Die eigentliche größere Repo-Trennung / Entkopplung passiert laut Nutzer **in einem anderen Chat**.

Konsequenz für diesen Chat:
- wir haben hier **keine große Repo-/Systemmigration** gemacht,
- sondern **Control-Center-seitige Operationalisierung und sprachliche/fachliche Entkopplung**.

---

## 5. Was in diesem Chat wirklich erreicht wurde

### 5.1 EFRO-Agent als Live-Wahrheit verankert

Der EFRO-Agent-Watchdog ist als primäre Live-Quelle verankert worden.

Wesentlicher Zustand:
- `summary_status` grün
- `ok = true`
- `degraded = false`
- `public_health_consecutive_failures = 0`
- Watchdog-Loop aktiv / stabil

Wichtige fachliche Konsequenz:
- **Live-Wahrheit = EFRO-Agent-Watchdog**
- **Handoff = Triage/Historie**, nicht mehr Live-Wahrheit

### 5.2 Control-Center-Admin / UI erweitert

Im Control Center wurde die Admin-/Dashboard-Seite so erweitert, dass ein sichtbarer **EFRO-Agent-Live-Status** angezeigt wird.

Die UI zeigt:
- Verbindung
- Summary-Status
- letzten Lauf
- Public-Health-Zähler

### 5.3 `/api/ops/watchdog`

Diese Route liefert EFRO-Agent-Zustand für das Control Center.

Sie ist die Grundlage dafür, dass UI und weitere Routen den Live-Status des EFRO-Agent lesen können.

### 5.4 `/api/ops/handoff`

Diese Route wurde erweitert und fachlich umgestellt.

Erreicht:
- `efroAgent` im Payload
- `liveTruth` im Payload
- `triage.liveSummaryStatus`
- `debugPrompt` enthält Live-Summary-Kontext
- Sprache teilweise von shop-/kataloglastig auf neutralere Ziel-/Inhalts-Semantik umgestellt
- zusätzlich `targetContext` ergänzt

Aktuell relevante Semantik in `handoff`:
- `liveTruth.handoffRole = target_triage_and_history`
- `targetContext.canonicalType = target`
- `targetContext.legacyRouteType = shop`

### 5.5 `/api/ops/shop/[shop]`

Diese Route wurde erweitert um:
- `efroAgent`
- `liveTruth`
- `targetContext`

Ziel:
- Kompatibilität zur bestehenden `shop`-Route erhalten,
- aber gleichzeitig einen plattformneutraleren fachlichen Rahmen bereitstellen.

### 5.6 `/api/ops/quality/[shop]`

Diese Route wurde erweitert um:
- `efroAgent`
- `liveTruth`

Ein späterer Versuch, dort ebenfalls `targetContext` direkt im API-Payload nachzuziehen, war **noch nicht erfolgreich verifiziert**. Dazu unten mehr unter „Offen / Inkonsistenzen“.

### 5.7 `lib/efro-quality-review.ts` fachlich neutralisiert

In der eigentlichen Quality-Textquelle wurden shop-/produkt-/kataloglastige Formulierungen bereits teilweise neutralisiert.

Erfolgreich umgestellt wurden u. a.:
- `Produktbasis vorhanden` -> `Inhaltsbasis vorhanden`
- `Keine verwertbare Produktbasis` -> `Keine verwertbare Inhaltsbasis`
- produktiver Katalog -> verwertbare Inhalts- oder Angebotsbasis
- echte Nutzung im Shop -> echte Nutzung im Zielkontext
- `Katalogqualität angreifbar` -> `Inhaltsqualität angreifbar`
- `Produktgruppen-Analyse` -> `Bereichs-Analyse`
- `Shop-Qualitätszentrale` -> `Qualitätszentrale`

Das ist ein wichtiger Schritt: **fachliche Entkopplung im Control Center**, ohne andere Repos anzufassen.

### 5.8 Direkter Dateischreibzugriff für relevante Control-Center-Dateien freigegeben

Der MCP Repo Reader wurde so erweitert, dass direkte Datei-Patches für ausgewählte `efro-control-center`-Dateien möglich sind.

Aktiv freigegebene Ziele:
- `efro-control-center-admin`
- `efro-control-center-shop-detail`
- `efro-control-center-handoff`
- `efro-control-center-shop-api`
- `efro-control-center-quality-api`
- `efro-control-center-quality-lib`

Das reduziert die Reibung für weitere kleine, präzise Patches in diesem Repo.

---

## 6. Aktueller Zustand – was als wahr gelten soll

### 6.1 Operative Wahrheit

Für Live-Zustand gilt:
- **nicht** primär alte Handoffs lesen
- **nicht** primär historische Fehlzustände lesen
- **sondern** den EFRO-Agent-Watchdog / `summary` als operative Live-Wahrheit lesen

### 6.2 Übergangssemantik

Die aktuelle fachliche Übergangssemantik ist:
- `canonicalType = target`
- `legacyRouteType = shop`

Diese Brücke ist bewusst gewählt:
- bestehende Konsumenten brechen nicht sofort,
- aber neue Arbeit kann schon target-zentriert erfolgen.

---

## 7. Bekannte offene Punkte / Inkonsistenzen

### 7.1 `quality` hat noch keine verifizierte `targetContext`-Ausgabe

Es wurde versucht, in `/api/ops/quality/[shop]` zusätzlich `targetContext` in den Payload einzubauen.

Der direkte Patch wurde zwar angestoßen, aber der anschließende Nutzercheck ergab:
- `targetContext.canonicalType = None`
- `targetContext.legacyRouteType = None`
- `targetContext.identifier = None`

Gleichzeitig blieb `liveTruth.summaryStatus = green` intakt.

Das bedeutet:
- der LiveTruth-/EFRO-Agent-Teil von `quality` funktioniert,
- aber `targetContext` ist dort **noch nicht verlässlich im API-Output angekommen**.

Status: **offen / erneut verifizieren**.

### 7.2 Quality-/Overview-/Shop-Sprache weiterhin teilweise Shopify-lastig

Trotz erster Neutralisierung bleibt im System weiterhin einiges shopify- oder shop-zentriert.

Beispiele:
- `shopDomain`
- `merchant`
- `productCount`
- bestimmte Commerce-/Shop-/Sync-Begriffe
- Overview-Sprache insgesamt

Das ist **kein technischer Blocker**, aber fachlich noch nicht fertig.

### 7.3 `nextAction` und einzelne Texte sind noch gemischt

Beispiel aus Handoff-/Quality-Kontext:
- `naechste aktion: Shop-Installation, Token und Produkt-Sync sofort prüfen.`

Das zeigt: selbst wenn `primaryFocus` und `attackNow` neutraler geworden sind, können noch einzelne Alttexte aus tieferen Datenquellen Shopify-lastig bleiben.

### 7.4 Worktree-/Git-Flow für `efro-control-center` war nicht zuverlässig nutzbar

Direkter Dateischreibzugriff wurde erfolgreich freigeschaltet.

Aber:
- der Worktree-/Git-Weg war mehrfach nicht stabil nutzbar
- teilweise wegen MCP-Tool-Link-Rotation
- teilweise weil Repo-/Git-Erkennung am Server nicht sauber griff

Für diesen Chat war der erfolgreiche Weg deshalb:
- **kleine direkte Dateipatches**
- lokale Build-/Runtime-Prüfung
- keine große Git-/Worktree-Orchestrierung erzwingen

---

## 8. Wichtige Dateien, die in diesem Chat relevant waren

### UI / Seiten
- `app/admin/page.tsx`
- `app/shops/[shop]/page.tsx`

### API-Routen
- `app/api/ops/watchdog/route.ts`
- `app/api/ops/handoff/route.ts`
- `app/api/ops/shop/[shop]/route.ts`
- `app/api/ops/quality/[shop]/route.ts`

### Fachliche Text-/Qualitätslogik
- `lib/efro-quality-review.ts`

### Doku / Parkstand
- `docs/PARKSTAND_EFRO_CONTROL_CENTER_2026-04-09.md`

---

## 9. Bekannte Arbeitsregeln aus diesem Chat

Der Nutzer wollte ausdrücklich:
- **keine Annahmen / keine Vermutungen**
- nur **verifizierte Aussagen**
- **formatierte**, robuste Befehle
- möglichst direktes, sauberes Vorgehen
- keine Änderungen an anderen Repos

Wichtige Kommunikations-/Arbeitsregel:
- bei textuellen Patches zuerst **echten Dateiinhalt** prüfen
- dann nur auf **real vorhandene Strings/Blöcke** patchen
- danach direkt **Build / API / Typecheck**

---

## 10. Was als nächstes sinnvoll ist

### Priorität 1 – `quality` targetContext sauber verifizieren / fixen

Da `handoff` und `shop` bereits `targetContext` sauber liefern, sollte als nächstes **`quality` auf denselben Stand gebracht** werden.

Ziel:
- `targetContext.canonicalType = target`
- `targetContext.legacyRouteType = shop`
- `targetContext.identifier = <shopDomain>`

Wichtig:
- keine anderen Repos anfassen
- nur `efro-control-center`

### Priorität 2 – weitere sprachliche Neutralisierung im Control Center

Danach:
- restliche Handoff-/Overview-/Quality-Sprache weiter neutralisieren
- verbleibende Shopify-/Katalog-/Produkt-Begriffe schrittweise entschärfen

### Priorität 3 – erst dann mögliche breitere Harmonisierung

Erst wenn `handoff`, `shop`, `quality`, `overview` fachlich sauber genug sind, ergibt eine größere Harmonisierung Sinn.

Nicht jetzt tun:
- keine harte Entfernung von `shop`
- keine sofortige Vollmigration auf `target`
- keine Änderungen an anderen Repos

---

## 11. Kurzfassung für den Nachfolger

Wenn du nur 10 Sekunden hast:

- **EFRO-Agent liefert die Live-Wahrheit**.
- **Control Center ist in diesem Chat operativ auf diese Live-Wahrheit umgestellt worden**.
- `handoff`, `shop`, `quality` lesen bereits `efroAgent` / `liveTruth`.
- `handoff` und `shop` sprechen bereits eine Übergangssemantik mit `targetContext`.
- `quality` ist fachlich textlich teilweise neutralisiert, aber `targetContext` dort ist **noch nicht verifiziert sauber im Output**.
- **Nur `efro-control-center` anfassen. Keine anderen Repos.**
- Nächster Schritt: `quality`-Payload targetContext sauber verifizieren/fixen und danach weitere sprachliche Neutralisierung im Control Center.

---

## 12. Merksatz

**Live-Wahrheit = EFRO-Agent-Watchdog.**

**Control Center = Operationalisierung dieser Wahrheit.**

**Zielrichtung = weg von Shopify-Semantik, hin zu plattformneutralen Targets – ohne bestehende Kompatibilität abrupt zu brechen.**
