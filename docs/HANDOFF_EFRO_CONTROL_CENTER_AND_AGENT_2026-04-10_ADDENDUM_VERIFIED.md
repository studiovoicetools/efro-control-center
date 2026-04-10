# EFRO Übergabe – Addendum (verifizierter Stand nach Runtime-Checks)

Stand: 2026-04-10
Bezieht sich auf: `docs/HANDOFF_EFRO_CONTROL_CENTER_AND_AGENT_2026-04-10.md`

## Zweck

Dieses Addendum aktualisiert den Handoff auf den inzwischen **verifiziert erreichten** Stand.
Es ersetzt nicht das ursprüngliche Handoff, sondern überschreibt gezielt die dort noch als offen markierten Punkte, soweit sie inzwischen live geprüft wurden.

---

## 1. Verifiziert geschlossen: `quality.targetContext`

Der zuvor offene Punkt
- `quality hat noch keine verifizierte targetContext-Ausgabe`

ist **nicht mehr offen**.

Live verifiziert wurde für:
- `GET /api/ops/quality/avatarsalespro.myshopify.com`

Dabei wurde erfolgreich bestätigt:
- `ok = true`
- `liveTruth.summaryStatus = green`
- `targetContext.canonicalType = target`
- `targetContext.legacyRouteType = shop`
- `targetContext.identifier = avatarsalespro.myshopify.com`
- `targetContext.label = avatarsalespro.myshopify.com`
- `targetContext.platformAgnostic = true`

Wichtige Ursache des früheren Fehlers:
- die Source-Route war bereits korrekt gepatcht
- der laufende Next-Prozess auf Port 3010 lieferte zunächst noch einen alten Build aus
- nach Rebuild + Neustart war der Payload korrekt

Konsequenz:
- Abschnitt `7.1` des ursprünglichen Handoffs ist fachlich **überholt**
- Priorität `quality targetContext verifizieren / fixen` ist **erledigt**

---

## 2. Verifiziert erreicht: weitere sprachliche Neutralisierung in `quality` und `watchdog`

Zusätzlich wurde die verbleibende shop-/produkt-/kataloglastige Sprache in den relevanten Control-Center-Pfaden weiter neutralisiert und live verifiziert.

### 2.1 Verifizierte `quality`-Änderungen

Live sichtbar in `/api/ops/quality/avatarsalespro.myshopify.com`:
- `nextAction = Installation, Zugriffsdaten und Inhaltssynchronisierung sofort prüfen`
- Alert-Titel: `Keine verwertbaren Inhalte gefunden`
- Alert-Detail: `Für dieses Ziel wurden aktuell keine verwertbaren Inhalte oder Angebote gefunden.`

### 2.2 Verifizierte `watchdog`-Änderungen

Live sichtbar in `/api/ops/watchdog`:
- `Installation, Zugriffsdaten und Inhaltssynchronisierung sofort prüfen`
- `Inhaltssynchronisierung und Event-Anbindung prüfen`

Wichtig:
- der ursprünglich dokumentierte Hinweis auf gemischte Alttexte wie
  `naechste aktion: Shop-Installation, Token und Produkt-Sync sofort prüfen.`
  ist für die jetzt live geprüften `quality`- und `watchdog`-Pfade **überholt**
- eine vollständige Gesamtneutralisierung des gesamten Control Centers ist damit **noch nicht abgeschlossen**, aber die zuvor kritisch sichtbaren Resttexte in diesen beiden Pfaden sind bereinigt

Konsequenz:
- Abschnitt `7.3` des ursprünglichen Handoffs ist für `quality`/`watchdog` **überholt**
- Priorität `weitere sprachliche Neutralisierung` bleibt als allgemeine Restarbeit bestehen, aber die klar sichtbaren Runtime-Texte in `quality` und `watchdog` sind bereits verbessert und verifiziert

---

## 3. Git-/Arbeitsstand ist jetzt sauberer als im Ursprungshandoff

Im Verlauf nach dem ursprünglichen Handoff wurde `efro-control-center` als echtes Git-Repo aufgesetzt und mit dem Remote verbunden:
- Remote: `https://github.com/studiovoicetools/efro-control-center.git`
- Initial Import wurde erfolgreich nach GitHub gepusht
- Deploy-Key / SSH-Pfad für den Server wurde erfolgreich eingerichtet

Relevante Branches:
- `main` = Initialimport
- `parallel/neutralize-quality-language-20260410` = konsolidierter Arbeitsbranch mit dem Sprach-Cleanup
- `parallel/neutralize-quality-language-20260410-wt` = technischer Hilfs-/Worktree-Branch

Konsequenz:
- die frühere Aussage, der Worktree-/Git-Flow für `efro-control-center` sei nicht zuverlässig nutzbar, war für den damaligen Stand richtig
- sie ist für den **neuen** Stand nur noch teilweise wahr
- Git/Remote/Branch-Arbeit ist jetzt grundsätzlich möglich und praktisch einsetzbar

---

## 4. Was weiterhin offen bleibt

Trotz der verifizierten Fortschritte bleiben diese Punkte offen:

1. **Breitere sprachliche Harmonisierung**
   - `shopDomain`, `merchant`, `productCount` und weitere Altsemantiken bestehen weiterhin in anderen Bereichen
   - das ist keine unmittelbare Runtime-Störung, aber fachlich noch nicht Endzustand

2. **Fachliche Priorisierung in `buildNextAction()`**
   - aktuell gewinnt bei gleichzeitigen Problemen z. B. `staleSync` vor dem Commerce-Fehler
   - das ist keine kaputte Funktion, sondern eine noch bewusst zu entscheidende Priorisierungsfrage

3. **Keine Änderungen an anderen Repos aus diesem Chat ableiten**
   - die Systemgrenze des ursprünglichen Handoffs bleibt bestehen:
   - operative Arbeit hier nur im `efro-control-center`

---

## 5. Aktualisierte Kurzfassung für den Nachfolger

Wenn du nur den jetzt gültigen Kurzstand brauchst:

- **EFRO-Agent liefert die operative Live-Wahrheit**.
- **Control Center liest diese Wahrheit und operationalisiert sie**.
- `handoff`, `shop`, `quality` lesen `efroAgent` / `liveTruth`.
- `quality` liefert jetzt **verifiziert** auch `targetContext`.
- `quality` und `watchdog` zeigen in den live geprüften Pfaden bereits neutralisierte Sprache.
- `efro-control-center` ist jetzt als Git-Repo mit Remote und Branches arbeitsfähig.
- Nächster sinnvoller Schritt ist **nicht mehr** `quality.targetContext`, sondern:
  - weitere sprachliche Harmonisierung
  - und ggf. die fachliche Priorisierung von `nextAction`

---

## 6. Merksatz nach aktuellem Stand

**Live-Wahrheit = EFRO-Agent-Watchdog.**

**Control Center = Operationalisierung dieser Wahrheit.**

**`quality.targetContext` = verifiziert geschlossen.**

**Nächste Arbeit = Restharmonisierung und Priorisierungsfeinschliff, nicht mehr Grundreparatur.**
