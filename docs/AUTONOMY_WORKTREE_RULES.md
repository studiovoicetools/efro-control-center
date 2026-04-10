# Autonomy Worktree Rules

## Standardprozess
1. Basis-Repo muss sauber sein
2. Nie direkt auf main patchen
3. Immer zuerst Worktree erstellen
4. Nur im Worktree patchen
5. Nach jedem Patch testen
6. Wenn Tests fehlschlagen: im selben Worktree weiterfixen und erneut testen
7. Erst wenn alles grün ist: committen
8. Danach nur auf Parallel-Branch pushen
9. Promotion auf main nur mit expliziter Nutzerfreigabe

## Verboten
- direkt auf main committen
- direkt auf main pushen
- ungetestete Änderungen pushen
- Runtime-Müll im Hauptrepo liegen lassen

## Minimale Prüfungen
- efro-control-center: ./scripts/ci-safe.sh
- efro-agent: ./scripts/ci-safe.sh
