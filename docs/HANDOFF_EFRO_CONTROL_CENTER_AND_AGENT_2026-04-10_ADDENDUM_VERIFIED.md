# EFRO Übergabe – Addendum (verifizierter und konsolidierter Stand)

Stand: 2026-04-10
Bezieht sich auf:
- `docs/HANDOFF_EFRO_CONTROL_CENTER_AND_AGENT_2026-04-10.md`
- `docs/HANDOFF_EFRO_CONTROL_CENTER_PROFESSIONAL_2026-04-10.md`

## Zweck

Dieses Addendum hält die Punkte fest, die gegenüber älteren Übergaben und Zwischenständen als **live verifiziert oder fachlich konsolidiert** gelten.

Es dient nicht mehr als reine Fehlerliste, sondern als kurze Klarstellung, welche früher offenen Punkte inzwischen geschlossen sind.

---

## 1. Verifiziert geschlossen: `quality.targetContext`

Der frühere offene Punkt zu `quality.targetContext` ist geschlossen.

Verifiziert wurde für `GET /api/ops/quality/avatarsalespro.myshopify.com`:
- `ok = true`
- `liveTruth.summaryStatus = green`
- `targetContext.canonicalType = target`
- `targetContext.legacyRouteType = shop`
- `targetContext.identifier = avatarsalespro.myshopify.com`
- `targetContext.label = avatarsalespro.myshopify.com`
- `targetContext.platformAgnostic = true`

Konsequenz:
- frühere Aussagen, `quality.targetContext` sei noch offen, sind überholt

---

## 2. Verifiziert verbessert: `quality`- und `watchdog`-Texte

Die kritischen shop-/produktlastigen Laufzeittexte in den relevanten `quality`- und `watchdog`-Pfaden wurden bereinigt.

Verifizierte Beispiele:
- `Installation, Zugriffsdaten und Inhaltssynchronisierung sofort prüfen`
- `Inhaltssynchronisierung und Event-Anbindung prüfen`
- `Keine verwertbaren Inhalte gefunden`
- `Für dieses Ziel wurden aktuell keine verwertbaren Inhalte oder Angebote gefunden.`

Konsequenz:
- die früher sichtbaren groben Alttexte in diesen Pfaden gelten nicht mehr als aktueller Hauptmangel

---

## 3. Verifiziert verbessert: `nextAction`-Priorisierung

Die frühere Inkonsistenz in `buildNextAction()` ist nicht mehr offen.

Die Priorisierung wurde so geschärft, dass Commerce-/Aktionsfehler nicht mehr vom stale-sync-Fall überdeckt werden, wenn sie operativ dringlicher sind.

Konsequenz:
- die Priorisierungsfrage gilt für den aktuellen Stand als bewusst entschieden

---

## 4. Verifiziert verbessert: sichtbare Restharmonisierung

Seit dem ursprünglichen Addendum wurde die sichtbare Harmonisierung des Control Centers deutlich weitergeführt.

Zusätzliche bereinigte Beispiele:
- `Response Cache` → `Antwort-Cache`
- `Readiness Score` → `Bereitschaftsgrad`
- `Settings-Quelle` → `Konfigurationsquelle`
- `Evidence öffnen` → `Nachweise öffnen`
- `Mock-Fallback` → `Fallback-Daten`
- `Alert` / `unknown` / `Hits` → `Hinweis` / `unbekannt` / `Treffer`
- `EFRO Admin` → `EFRO Operator-Zentrale`
- `Summary-Status` → `Live-Summary`
- `Priority` → `Priorität`

Konsequenz:
- der Schwerpunkt liegt nicht mehr auf grober sichtbarer Restharmonisierung, sondern – falls weitergearbeitet wird – auf struktureller Plattform-Agnostik

---

## 5. Git-/Arbeitsstand

`efro-control-center` ist arbeitsfähig als echtes Git-Repo mit Remote und Parallel-Branches.

Der aktuell maßgebliche Abschlussstand des Polishing-Zyklus ist:
- Branch: `parallel/control-center-polish-20260410-closing-visible-rests`
- Relevanter Abschluss-Commit: `c0326c7`

Konsequenz:
- Aussagen, Git/Branch-Arbeit sei im Repo grundsätzlich nicht praktikabel, sind für den heutigen Stand überholt

---

## 6. Was weiterhin offen bleibt

Weiterhin offen, aber **nicht** mehr als einfacher UI-Polish:

1. interne Feldnamen wie `shopDomain`, `productCount`
2. historische Routen wie `/shops/...`, `/merchant/...`, `/api/ops/shop-config/...`
3. tiefere API-/Datenmodell-Semantik
4. vollständige interne Plattform-Agnostik

---

## 7. Aktualisierte Kurzfassung

- **EFRO-Agent liefert die operative Live-Wahrheit.**
- **Control Center operationalisiert und visualisiert diese Wahrheit.**
- `quality.targetContext` ist verifiziert geschlossen.
- `nextAction`-Priorisierung ist bewusst geschärft.
- die sichtbare Restharmonisierung ist weitgehend abgeschlossen.
- die nächste sinnvolle Phase wäre nicht weiterer Mikro-Polish, sondern ein bewusster target-first / plattformagnostischer Strukturblock.

---

## 8. Merksatz

**Live-Wahrheit = EFRO-Agent-Watchdog.**

**Control Center = Diagnose- und Operator-Schicht über dieser Wahrheit.**

**Die nächste echte Restarbeit liegt eher in interner Struktur als in sichtbaren UI-Alttexten.**
