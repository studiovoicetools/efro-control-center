# EFRO Control Center

## Zweck
Dieses Verzeichnis ist die zentrale, repo-übergreifende Steuerungs- und Wahrheitsbasis für EFRO.
Hier werden Architektur, Evidenz, offene Risiken, Patch-Regeln und Go-Live-Kriterien gepflegt.
Runtime-Code wird hier nicht entwickelt. Dieses Verzeichnis dient der Kontrolle, nicht der Produktlogik.

## Geltungsbereich
Betroffene Repos:
- efro
- efro-widget
- efro-brain
- efro-shopify

## Arbeitsregel
Copilot und andere Agenten dürfen zunächst nur analysieren und dokumentieren.
Ohne ausdrückliche Freigabe dürfen keine Runtime-Dateien geändert werden.

## Dokument-Hierarchie
1. EFRO_CONTROL_CENTER.md
2. ARCHITECTURE_OVERVIEW.md
3. REPO_RELATIONS.md
4. RUNTIME_FLOWS.md
5. ENV_CONTRACT.md
6. DEFINITION_OF_DONE.md
7. PATCH_POLICY.md
8. CURRENT_BUGS.md
9. EVIDENCE_REGISTER.md

## Status-Labels
- Belegt: direkt durch Datei, Pfad, Import, Route, Test, Log oder Konfiguration nachgewiesen
- Wahrscheinlich: starke Indizien vorhanden, aber noch nicht vollständig end-to-end belegt
- Unbestätigt: Annahme oder offener Punkt, darf nicht als Wahrheit behandelt werden

## Verbindliche Lesereihenfolge für jeden Agenten
1. EFRO_CONTROL_CENTER.md
2. PATCH_POLICY.md
3. CURRENT_BUGS.md
4. ARCHITECTURE_OVERVIEW.md
5. REPO_RELATIONS.md
6. RUNTIME_FLOWS.md
7. ENV_CONTRACT.md
8. DEFINITION_OF_DONE.md
9. EVIDENCE_REGISTER.md

## Harte Regeln
- kein patch ohne ausgabe
- erst analyse, dann evidenz, dann plan, dann patch
- kein stiller refactor
- keine änderung ohne betroffene dateien
- keine vermutung als fakten formulieren
- bei unsicherheit muss "unbestätigt" notiert werden
- vor jedem späteren patch: backup + patch plan a + patch plan b

## Aktueller Modus
Analyse- und Architekturmodus.
Copilot dient vorerst nur als Analyst.
