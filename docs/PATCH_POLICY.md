# Patch Policy

## Grundsatz
Kein Runtime-Patch ohne vorherige Analyse, Evidenz, Backup und klaren Plan.

## Harte Regeln
- kein patch ohne ausgabe
- zuerst root cause, dann patch
- keine stillen refactors
- keine dateiänderung ohne begründung
- nur minimal nötige änderungen
- erst analyse, dann patch
- bei Unsicherheit: stoppen und als unbestätigt markieren

## Pflicht vor jedem Patch
1. Betroffene Dateien nennen
2. Root Cause in wenigen Sätzen benennen
3. Backup/Checkpoint-Befehl angeben
4. Patch Plan A formulieren
5. Patch Plan B formulieren
6. Vorab-Checks nennen
7. Nachher-Checks nennen

## Pflichtblock für jeden späteren Patch
Backup:
- exakter backup-befehl

Patch Plan A:
- minimalinvasiver Hauptweg

Patch Plan B:
- fallback bei Patch-Fehlschlag oder falscher Annahme

Checks vorher:
- git status
- typecheck/lint/tests soweit sinnvoll

Checks nachher:
- git diff
- typecheck/lint/tests
- zielbezogener smoke check

## Verboten
- "maybe fix"
- mehrere Themen in einem Patch mischen
- Runtime-Dateien ändern, obwohl die SSOT- oder Flow-Frage ungeklärt ist
