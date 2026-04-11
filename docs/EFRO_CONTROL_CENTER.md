# EFRO Control Center

Stand: 2026-04-10

## Zweck

Dieses Repository enthält das operative Control Center für EFRO.

Das Control Center ist **nicht** die Live-Wahrheit selbst, sondern die
- Visualisierung,
- Aggregation,
- Triage-
- und Operator-Schicht

über dem aktuellen EFRO-Livezustand.

Die primäre Live-Wahrheit kommt aus dem **EFRO-Agent-Watchdog**.

## Aktuelle operative Wahrheit

Für den aktuellen Stand gilt:

- **EFRO-Agent `/api/watchdog/summary` = primäre Live-Wahrheit**
- **Control Center = Operationalisierung und Sichtbarmachung dieser Wahrheit**
- **Handoffs = Triage / Historie, nicht primäre Live-Wahrheit**

## Aktueller Reifegrad

Das `efro-control-center` ist nach dem aktuellen Arbeitsstand operativ deutlich stabiler und sprachlich deutlich harmonisierter als in den frühen Phase-1-Dokumenten.

Erreicht sind insbesondere:
- `quality` mit verifiziertem `targetContext`
- `liveTruth`-Einbindung in relevante Control-Center-Pfade
- priorisierte `nextAction`-Logik
- sichtbare UI-Harmonisierung in Overview, Detail, Onboarding, Admin und interner Quality-Sicht
- deutlich reduzierte shop-/merchant-/produktlastige Sichtsprache

## Was dieses Repo aktuell ist

Dieses Repo ist heute:
- das operative UI- und API-Control-Center für EFRO
- die sichtbare Diagnose- und Operator-Schicht
- der Ort für Control-Center-spezifische Harmonisierung und Triage-Verbesserungen

Dieses Repo ist aktuell **nicht**:
- die alleinige Systemwahrheit über alle EFRO-Komponenten
- der alleinige Runtime-Ort des EFRO-Agenten
- bereits vollständig intern plattformagnostisch

## Geltungsbereich

Innerhalb dieses Repos werden vor allem gepflegt:
- Control-Center-UI
- Control-Center-APIs
- sichtbare Operator- und Qualitätstexte
- Handoff- und Triage-Dokumentation

Historisch gewachsene Bezüge auf `shop`, `merchant`, `shopDomain`, `productCount` oder Shopify-Routen können intern weiterhin bestehen, auch wenn die sichtbare Sprache inzwischen deutlich stärker target-/inhaltsbezogen ist.

## Lesereihenfolge für Nachfolger

1. `EFRO_CONTROL_CENTER.md`
2. `EFRO_CONTROL_CENTER_MASTER.md`
3. `HANDOFF_EFRO_CONTROL_CENTER_AND_AGENT_2026-04-10.md`
4. `HANDOFF_EFRO_CONTROL_CENTER_AND_AGENT_2026-04-10_ADDENDUM_VERIFIED.md`
5. `HANDOFF_EFRO_CONTROL_CENTER_PROFESSIONAL_2026-04-10.md`

## Einordnung älterer Dokus

Ältere Phase-, Parkstand- und Spezifikationsdokumente bleiben als Historie relevant, sind aber **nicht automatisch der heutige Wahrheitsstand**.

Wenn ältere und neuere Dokus voneinander abweichen, gilt:

1. live verifizierter Stand
2. professioneller Handoff / verifizierte Addenda
3. ältere Master-/Phase-/Parkstand-Dokumente

## Harte Regel für Folgearbeit

Für operativen Live-Zustand immer zuerst den EFRO-Agent-Watchdog betrachten.

Für weitere Arbeit im `efro-control-center` gilt:
- erst aktuelle kanonische Doku lesen
- dann Live-/API-Stand prüfen
- erst danach patchen oder weiterharmonisieren
