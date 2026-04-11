# EFRO Control Center Master

Stand: 2026-04-10

## Zweck

Dieses Dokument ist die aktuelle Master-Zusammenfassung für den operativen Stand des `efro-control-center`.

Es beschreibt nicht mehr den frühen Submission-/Phase-1-Wunschzustand, sondern den heute tatsächlich erreichten Stand nach den Arbeiten an:
- Live-Truth-Anbindung an den EFRO-Agenten
- Quality-/Watchdog-Operationalisierung
- sichtbarer Restharmonisierung des Control Centers

## Aktuelle Kernwahrheiten

### 1. Live-Wahrheit
- **EFRO-Agent `/api/watchdog/summary` ist die primäre Live-Wahrheit**
- das Control Center soll diesen Status primär lesen und sichtbar machen

### 2. Rolle des Control Centers
Das Control Center ist heute vor allem:
- Diagnose-Schicht
- Operator-Schicht
- Triage-/Handoff-Schicht
- Quality-/Detail-/Overview-Schicht

Es ist **nicht** die alleinige Runtime-Wahrheit, sondern die Operationalisierung dieser Wahrheit.

### 3. Plattform-Semantik
Die sichtbare Sprache des Control Centers ist deutlich stärker target-/inhaltsbezogen als zu Beginn.

Dennoch bestehen intern weiterhin historische Reste in:
- Routen
- Feldnamen
- Datenannahmen

Daher gilt aktuell:
- **sichtbar weitgehend harmonisiert**
- **intern noch nicht vollständig plattformagnostisch**

## Was im aktuellen Stand erreicht ist

### Quality / Target Context
- `quality` liefert verifiziert `targetContext`
- `liveTruth.summaryStatus` bleibt grün
- `targetContext` und `liveTruth` sind gemeinsam sichtbar

### Watchdog / Next Action
- `nextAction` priorisiert operativ sinnvoller
- Commerce-/Aktionsfehler werden nicht mehr hinter stale sync versteckt

### Sichtbare UI-Harmonisierung
Die wichtigsten sichtbaren Restbegriffe wurden harmonisiert, u. a.:
- `Shops` → `Ziele`
- `Produkte` → `Inhalte`
- `Merchant` / `Merchant-Dashboard` → `Dashboard`
- `Shop-Detail öffnen` → `Ziel-Detail öffnen`
- `Response Cache` → `Antwort-Cache`
- `Readiness Score` → `Bereitschaftsgrad`
- `Evidence` → `Nachweise`
- `Mock-Fallback` → `Fallback-Daten`

## Aktuell maßgeblicher Arbeitsstand

Bester Arbeitsstand für spätere Main-Promotion:
- Branch: `parallel/control-center-polish-20260410-closing-visible-rests`
- Relevanter Abschluss-Commit: `c0326c7`

## Was noch offen ist

Nicht mehr als UI-Polish, sondern als nächste Phase:
- strukturelle Plattform-Agnostik innerhalb des Repos
- vorsichtige target-first-Kompatibilität in Routen und Datenfeldern
- Abbau historischer `shop*`-Semantik ohne Breaking Changes

## Was als historisch zu lesen ist

Ältere Phase-, Parkstand- und Spezifikationsdokumente bleiben als Verlauf relevant, sind aber nicht automatisch heutige Wahrheit.

Wenn ältere und neuere Dokus kollidieren, gilt:
1. live verifizierter Runtime-Stand
2. aktuelle Handoffs / verifizierte Addenda
3. diese Master-Doku
4. ältere Phase-/Parkstand-/Spec-Dokumente

## Empfohlene nächste Lesereihenfolge

1. `EFRO_CONTROL_CENTER.md`
2. `EFRO_CONTROL_CENTER_MASTER.md`
3. `HANDOFF_EFRO_CONTROL_CENTER_AND_AGENT_2026-04-10.md`
4. `HANDOFF_EFRO_CONTROL_CENTER_AND_AGENT_2026-04-10_ADDENDUM_VERIFIED.md`
5. `HANDOFF_EFRO_CONTROL_CENTER_PROFESSIONAL_2026-04-10.md`

## Kurzfazit

Das `efro-control-center` ist für den sichtbaren Restharmonisierungsauftrag weitgehend in einem guten Abschlusszustand.

Die nächste sinnvolle Arbeit ist nicht weiterer Mikro-Polish, sondern – falls gewünscht – ein bewusster interner Schritt Richtung target-first / plattformagnostische Strukturangleichung.
