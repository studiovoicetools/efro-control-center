# EFRO Phase-A-Konsolidierung

Stand: 2026-04-10

## Zweck
Diese Notiz hält den nachträglich verifizierten Konsolidierungsstand zu Phase A fest. Sie ergänzt die Zwischenübergabe vom 2026-04-08 um einen kurzen Freigabe-/Promote-Blick, damit der nächste Schritt nicht erneut in Analyse zerfällt.

## Arbeitsregel
- zuerst die maßgebliche MD vollständig lesen
- den aktuellen Stand immer kurz mit angeben
- Unklarheiten direkt im Chat klären

---

## 1. Aktueller Stand, kurz
Phase A ist fachlich als sauberer Zwischenstand konsolidierbar.

Verifiziert wurde:
- `efro-brain` Phase-A-Worktree ist weiterhin vorhanden und der Typecheck läuft grün
- `efro-widget` Phase-A-Worktree ist weiterhin vorhanden und der Typecheck läuft grün
- `efro` ist im Basis-Repo sauber auf `main`

Gleichzeitig gilt:
- die Basis-Repos `efro-brain` und `efro-widget` sind aktuell nicht der richtige Wahrheitsanker für Phase A, weil dort lokale Nebenartefakte / Verschmutzungen sichtbar sind
- die Phase-A-Bewertung muss daher bewusst über die dokumentierten Phase-A-Worktrees / Branches / Commits erfolgen, nicht über den momentanen Alltagszustand der Basis-Repos

---

## 2. Verifizierte Konsolidierungslogik

### `efro-brain`
Phase-A-Linie aus der Zwischenübergabe bleibt fachlich tragfähig:
- Rolle klarer Richtung Core-nahe Runtime mit sichtbarer Shopify-Kompatibilitäts-/Fallback-Grenze
- dokumentierte Phase-A-Commits bleiben der maßgebliche Zwischenstand
- Typecheck des dokumentierten Phase-A-Worktrees lief am 2026-04-10 erneut sauber durch

### `efro-widget`
Phase-A-Linie bleibt fachlich tragfähig:
- Rolle klarer Richtung EFRO-Frontend mit sichtbaren Shopify-Kompatibilitätsresten statt stiller Kernannahmen
- dokumentierte Phase-A-Commits bleiben der maßgebliche Zwischenstand
- Typecheck des dokumentierten Phase-A-Worktrees lief am 2026-04-10 erneut sauber durch

### `efro`
Meta-/Positionierungslinie bleibt ein sinnvoller flankierender Phase-A-Baustein:
- nicht mehr nur Shopify-only formuliert
- weiterhin Shopify-first, aber anschlussfähig an Core + Adapter-Zielbild
- Basis-Repo war zum Prüfzeitpunkt sauber

---

## 3. Was daraus für Konsolidierung folgt
Phase A ist jetzt nicht mehr primär eine Analyseaufgabe.

Der sinnvolle Lesestand ist:
- `efro-brain` = technisch und fachlich als Phase-A-Zwischenstand belastbar
- `efro-widget` = technisch und fachlich als Phase-A-Zwischenstand belastbar
- `efro` = meta-/positionierungsseitig sinnvoller Begleitbaustein

Wichtig:
- die lokalen Verschmutzungen in den Basis-Repos von `efro-brain` und `efro-widget` entwerten den dokumentierten Phase-A-Stand nicht
- sie bedeuten nur, dass Promote-/Freigabeentscheidungen bewusst an den dedizierten Phase-A-Linien hängen müssen

---

## 4. Promote-Empfehlung (fachlich)

### Empfehlung A — als kontrollierten Zwischenstand parken
Für den Moment ist dies die sauberste Linie:
- `efro-brain`: Phase-A-Branch als referenzierbaren Zwischenstand behalten
- `efro-widget`: Phase-A-Branch als referenzierbaren Zwischenstand behalten
- `efro`: Phase-A-Meta-Änderung als Referenz für Positionierung behalten

Begründung:
- Phase A erfüllt bereits ihren Zweck
- die Änderungen sind klein, reversibel und erklärbar
- ein vorschnelles Vermischen mit den aktuell verschmutzten Basis-Repos würde den klaren Zwischenstand eher verwässern als verbessern

### Empfehlung B — spätere Promotion nur kontrolliert
Wenn promoted wird, dann kontrolliert und repoweise:
- zuerst `efro-brain`
- danach `efro-widget`
- `efro` flankierend dazu oder davor, falls die Positionierungswahrheit früh sichtbar sein soll

Nicht empfohlen als nächster Sofortschritt:
- Phase-A-Änderungen jetzt hektisch in verschmutzte Alltagsbranches hineinzuziehen
- wegen des separaten `efro-shopify`-Themas die Phase-A-Konsolidierung zu vermischen

---

## 5. Verhältnis zu `efro-shopify`
`efro-shopify` bleibt ein separater Fixstrang.

Stand dazu:
- inhaltlich weiterhin plausibel fertig
- operativ weiterhin nur sinnvoll weiterzuverfolgen, wenn der GitHub-Remote-/403-Rechteblocker sauber gelöst ist

Fazit:
- `efro-shopify` ist aktuell **nicht** der richtige Taktgeber für Phase A
- Phase A sollte unabhängig davon sauber abgeschlossen / geparkt werden

---

## 6. Nächster sinnvoller Schritt
Der nächste fachlich richtige Schritt ist jetzt:

> Phase A bewusst als konsolidierten Zwischenstand akzeptieren und daraus eine kontrollierte Phase-B-Vorbereitung ableiten.

Das bedeutet konkret:
- Promote-Ziel je Repo festlegen
- Phase-A-Linien bewusst parken oder später gezielt promoten
- danach Phase B vorbereiten: Tenant-/Shop-Modell neutralisieren und Produkt-/Katalogmodell weiter vom Shopify-Datenmodell lösen

---

## 7. Kurzfazit
Phase A ist zum Stand 2026-04-10 konsolidierungsfähig.

Der belastbare Kern ist:
- dokumentierte Phase-A-Worktrees / Branches / Commits
- erneut grüne technische Verifikation für `efro-brain` und `efro-widget`
- klare Trennung zwischen Phase-A-Zwischenstand und separatem `efro-shopify`-Rechteblocker

Der richtige operative Reflex ist daher nicht mehr weitere Grundsatzanalyse, sondern geordnete Konsolidierung mit klarer Promote-Entscheidung pro Repo.
