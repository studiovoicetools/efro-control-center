# Quality Language Cleanup – Next Steps

Stand: 2026-04-10

## Verifizierter Status

Der zuvor offene Punkt `quality.targetContext` ist jetzt operativ verifiziert.

Erfolgreich geprüft wurde für:
- `GET /api/ops/quality/avatarsalespro.myshopify.com`

Soll/Ist jetzt erfüllt:
- `ok = true`
- `liveTruth.summaryStatus = green`
- `targetContext.canonicalType = target`
- `targetContext.legacyRouteType = shop`
- `targetContext.identifier = avatarsalespro.myshopify.com`
- `targetContext.label = avatarsalespro.myshopify.com`
- `targetContext.platformAgnostic = true`

Wichtige Ursache des früheren Fehlers:
- die Source-Route war bereits korrekt
- der laufende Next-Prozess auf Port 3010 lieferte aber zunächst noch einen alten Build aus
- nach Rebuild + Neustart war der Payload korrekt

## Nächster sinnvoller Cleanup

Der nächste klare Aufräumpunkt im `efro-control-center` ist nicht mehr `targetContext`, sondern die noch verbleibende shop-/produkt-/kataloglastige Sprache in den Quality-/Ops-Daten.

## Primäre Patch-Ziele

### 1. `lib/ops-data.ts`

Diese Datei erzeugt aktuell mehrere noch nicht neutralisierte Texte.

#### `buildNextAction()`
Aktuelle Formulierungen:
- `Shop-Installation, Token und Produkt-Sync sofort prüfen`
- `Produkt-Sync und Webhooks prüfen`
- `Commerce-Flow und Draft-Order-Fehler prüfen`
- `Katalog-Duplikate und Titelqualität prüfen`
- `Brain-Cache-Verhalten und Query-Normalisierung prüfen`

Empfohlene neutralere Zielrichtung:
- `Installation, Zugriffsdaten und Inhaltssynchronisierung sofort prüfen`
- `Inhaltssynchronisierung und Event-Anbindung prüfen`
- `Commerce-Flow und Aktionsfehler prüfen`
- `Inhaltsduplikate und Benennungsqualität prüfen`
- `Brain-Cache-Verhalten und Query-Normalisierung prüfen`

#### Alert-Texte
Aktuelle Formulierungen:
- `Keine Produkte gefunden`
- `Für diesen Shop wurden aktuell keine Produkte im Katalog gefunden.`
- `${shop.duplicateCandidateCount} doppelte Produkttitel erkannt.`

Empfohlene neutralere Zielrichtung:
- `Keine verwertbaren Inhalte gefunden`
- `Für dieses Ziel wurden aktuell keine verwertbaren Inhalte oder Angebote gefunden.`
- `${shop.duplicateCandidateCount} doppelte Inhaltstitel oder Bezeichnungen erkannt.`

### 2. `app/api/ops/watchdog/route.ts`

Dort gibt es noch fallbackartige Alttexte:
- `Shop-Installation pruefen`
- `Commerce pruefen`

Empfohlene neutralere Zielrichtung:
- `Installation und Anbindung pruefen`
- `Commerce-Flow pruefen`

## Wichtige Randbedingung

In dieser Umgebung war ein Worktree-basierter Patchversuch für `efro-control-center` nicht nutzbar, weil der Repo-Pfad beim Worktree-Aufruf nicht als Git-Repository erkannt wurde.

Fehlerbild:
- `fatal: not a git repository (or any of the parent directories): .git`

Das bedeutet:
- die nächste Textbereinigung sollte entweder
  - per direktem Dateipatch auf freigegebenen Dateien,
  - oder in einer Umgebung mit funktionsfähigem Git-/Worktree-Zugriff
  erfolgen.

## Priorität

1. `lib/ops-data.ts` neutralisieren
2. `app/api/ops/watchdog/route.ts` Fallback-Texte neutralisieren
3. neu builden
4. Port-3010-Prozess neu starten
5. `/api/ops/quality/[shop]`, `/api/ops/watchdog` und `/api/ops/overview` erneut gegen Beispieltargets prüfen
