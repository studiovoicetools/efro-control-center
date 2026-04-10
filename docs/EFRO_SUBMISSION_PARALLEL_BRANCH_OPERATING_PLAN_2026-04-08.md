# EFRO Submission / Parallel-Branch Operating Plan

Stand: 2026-04-08

## Zweck
Diese Ergänzung passt die laufende EFRO-Arbeit an die realen Projektbedingungen an:
- Shopify-Submission ist bereits eingereicht und wartet seit >10 Tagen auf Prüferzuweisung.
- `main` ist tabu.
- Änderungen dürfen nur über Worktrees und freigegebene Parallel-Branches laufen.
- Ein anderer Chat bearbeitet bereits `efro-agent` und `efro-control-center`.

Dieses Dokument verhindert Doppelarbeit und falsche operative Empfehlungen.

---

## 1. Verbindliche Rahmenbedingungen

### 1.1 Shopify-Submission-Status
Der relevante Geschäftsrahmen ist nicht "vor Submission", sondern **nach Übergabe an Shopify**.
Der operative Fokus verschiebt sich daher von unkontrollierten Großumbauten hin zu:
- Stabilität
- Wahrheit / Dokumentation
- kontrollierter Bereinigung
- branch-sicheren Verbesserungen
- Vorbereitung auf Review-Rückfragen und Live-Betrieb

### 1.2 Branch-Regel
`main` bleibt tabu.

Erlaubte Arbeitsform:
- Worktree
- paralleler Branch
- kontrollierter Commit
- optional Remote-Sicherung auf freigegebenem Parallel-Branch

Nicht empfohlen:
- direkte Bereinigung oder Umbauten auf `main`
- "mal schnell" etwas im Basis-Workspace korrigieren, wenn dadurch andere Parallel-Arbeit blockiert wird

### 1.3 Chat-Trennung
Bereits anderweitig in Bearbeitung:
- `efro-agent`
- `efro-control-center`

Daraus folgt fuer diesen Arbeitsstrang:
- keine Doppelarbeit an denselben Baustellen
- vorhandene Ergebnisse nur als Abhängigkeit / Kontext berücksichtigen
- dieser Arbeitsstrang soll vor allem die **Repo-Wahrheit, Doku-Wahrheit und branch-sichere Bereinigung** in den Kern-Repos vorantreiben

---

## 2. Bereits verifizierter Kontext aus anderen Arbeitsständen

### 2.1 efro-agent
Verifiziert dokumentiert:
- Doku liegt im Repo `efro`
- Runtime liegt im separaten Repo `efro-agent`
- Branches / Worktrees wurden geprüft
- relevanter Fixstand existiert auf freigegebenem Parallel-Branch
- offener Restschritt ist operativ: laufenden Dienstpfad angleichen und Browser-Endprüfung durchführen

Konsequenz:
- dieser Chat soll **nicht** parallel versuchen, die Agent-Runtime erneut neu zu analysieren oder umzubauen
- allenfalls abhängigkeitsseitig referenzieren

### 2.2 efro Doku-/Wahrheitsbereinigung
Verifiziert aus Nutzerhinweis:
- das `efro`-Repo wurde bereits stark in Richtung Doku-Wahrheit, Altlast-Prüfung und moderner 3-Repo-/BrainV2-Wahrheit bereinigt
- `ARCH_SELLERBRAIN` wurde vorbereitet
- `COPILOT_BRAIN` wurde modernisiert und gesichert
- Worktrees wurden kontrolliert genutzt
- Push-Blocker wurden eingegrenzt und teilweise gelöst
- Gesamtschätzung im bereinigenden Chat:
  - Doku-/Wahrheitsbereinigung ca. 94 %
  - gesamtes `efro`-Aufräumen ca. 81 %

Konsequenz:
- dieses Repo ist **nicht mehr im Stadium "von null inventarisieren"**
- es braucht jetzt vor allem:
  - Restblocker sauber abbauen
  - Dirty-Basiszustände beherrschbar machen
  - bereits erarbeitete Parallel-Branches sichern
  - keine redundante Neuanalyse mit Rückfall auf alte Annahmen

---

## 3. Neue operative Priorisierung

## Priorität A — Submission-safe Repo-Hygiene
Das bedeutet:
1. keine riskanten Strukturbrüche
2. keine main-Eingriffe
3. keine unkontrollierten Löschwellen
4. nur branch-sichere Bereinigung in Worktrees
5. jede Bereinigung muss dokumentieren:
   - warum Datei Altlast / Backup / Parkzustand ist
   - ob sie archiviert, gelöscht oder SSOT-relevant ist

## Priorität B — Dirty-Blocker beseitigen, die Parallel-Arbeit behindern
Beispielhaft schon belegt:
- `docs/ARCH_SELLERBRAIN.md` blockiert Checkout / Push-Fluss durch dirty Basis-Workspace

Das ist wichtiger als theoretische Architekturdebatten, weil es reale Branch-Arbeit stoppt.

## Priorität C — Repo-Wahrheit statt Parallel-Wahrheiten
In `efro` soll die bereinigte Doku-Wahrheit weiter konsolidiert werden, aber jetzt kontrolliert:
- aktuelle BrainV2-/3-Repo-Realität
- klare Nicht-SSOT-Kennzeichnung alter Dokus
- keine widersprüchlichen Master-Dokumente

## Priorität D — Andere Chats nicht duplizieren
- Agent-Runtime-Fixstand respektieren
- Control-Center-Entwicklung respektieren
- in diesem Strang nur Schnittstellen, Doku-Wahrheit, Repo-Hygiene und submission-sichere Ordnung forcieren

---

## 4. Angepasste Roadmap fuer diesen Arbeitsstrang

### Phase 1 — Branch-/Worktree-Blocker abbauen
Ziel:
- Parallel-Branches muessen wieder reibungslos bewegbar, pushbar und referenzierbar sein

Aufgaben:
1. dirty Basiszustände identifizieren, die Checkout / Push verhindern
2. nur diese Blocker zuerst ordnen
3. `ARCH_SELLERBRAIN`-Blocker kontrolliert lösen
4. keine Vermischung mit Agent-/Control-Center-Themen

### Phase 2 — efro-Restbereinigung kontrolliert fertigstellen
Ziel:
- das bereits weit fortgeschrittene `efro`-Cleanup nicht neu anfangen, sondern auf 100 % kontrolliert zu Ende bringen

Aufgaben:
1. Altlast-Dokus final klassifizieren
2. aktive SSOT-Dokus markieren
3. Park-/Handover-/Momentaufnahme-Dateien sauber abgrenzen
4. modernisierte Kern-Dokus remote sichern

### Phase 3 — Repo-übergreifende Wahrheitsmatrix
Ziel:
- klare Zuordnung, welches Repo wofür wahr ist

Mindestmatrix:
- `efro`
- `efro-widget`
- `efro-brain`
- `efro-shopify`
- `efro-agent`
- `efro-control-center`

Pro Repo:
- Runtime-Rolle
- Doku-Rolle
- Produktiv-Relevanz
- Submission-Relevanz
- aktueller Pflegezustand

### Phase 4 — Submission-sichere technische Nacharbeit
Ziel:
- nur Änderungen, die nach Submission sinnvoll und risikoarm sind

Beispiele:
- Doku-Wahrheit
- interne Beobachtbarkeit
- branch-sichere Aufräumarbeiten
- nicht-invasive Stabilitätsverbesserungen

Nicht Ziel in diesem Strang:
- große Produktarchitektur neu schneiden
- Mainline-Rewrite
- ungeplante Migrationen mit unklarem Review-Effekt

---

## 5. Praktische Arbeitsregel ab jetzt

Bei jeder neuen Aufgabe zuerst prüfen:
1. betrifft es `main`? -> dann nein
2. betrifft es Agent oder Control Center, die schon woanders bearbeitet werden? -> dann nicht doppeln
3. blockiert ein dirty Workspace die Parallel-Arbeit? -> zuerst das lösen
4. ist es submission-sicher und branch-sicher? -> dann ja

---

## 6. Klare Empfehlung

Für den aktuellen Moment ist der fachlich richtige Fokus **nicht**:
- alles nochmal global neu analysieren
- Agent und Control Center parallel doppelt bearbeiten
- allgemeine Millionen-Shop-Versprechen diskutieren

Der richtige Fokus ist:
1. bereits laufende Parallel-Arbeit respektieren
2. `efro`-Bereinigung kontrolliert fertigziehen
3. konkrete Branch-/Worktree-Blocker auflösen
4. Doku-Wahrheit weiter härten
5. danach gezielt nur die submission-sicheren technischen Restarbeiten angehen

---

## 7. Nächster sinnvoller Schritt in diesem Strang

Der naechste sinnvolle Schritt ist:
- den verifizierten `ARCH_SELLERBRAIN`-Push-Blocker kontrolliert lösen,
- ohne `main` anzutasten,
- und den bereits vorbereiteten Parallel-Branch sauber herausbringen.

Danach:
- Restbereinigung im `efro`-Repo entlang der bereits erreichten 81 % kontrolliert fertigstellen.