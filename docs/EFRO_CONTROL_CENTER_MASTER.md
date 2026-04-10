EFRO Control Center Master

Stand: 2026-03-28

Zweck

EFRO braucht ein professionelles Kontrollsystem, das alle installierten Shops sichtbar macht, Probleme früh erkennt, Kosten transparent überwacht und klare nächste Schritte vorgibt. Dieses Control Center ist die operative Single Source of Truth nach der Shopify-Einreichung.

Eingefrorener Submission-Stand

Dieses Dokument basiert auf dem eingefrorenen Submission-Stand.

Eingefrorene Repos
efro-brain
Freeze-Tag: submission-freeze-2026-03-28-164814-efro-brain
Freeze-Commit: 8a606de80b7fa2bd40221c1d454406a0f9457174
efro-shopify
Freeze-Tag: submission-freeze-2026-03-28-164814-efro-shopify
Freeze-Commit: 0ddf457f478425f0b483808e0076add368b1c900
efro-widget
Freeze-Tag: submission-freeze-2026-03-28-164814-efro-widget
Freeze-Commit: ba946c471f241584d8c11e068d219206691a6270
Entwicklungszweige nach Submission
parallel/efro-brain-2026-03-28-164814
parallel/efro-shopify-2026-03-28-164814
parallel/efro-widget-2026-03-28-164814
Mission

Das Control Center muss diese Fragen sofort beantworten:

Welche Shops sind gesund?
Welche Shops sind kaputt oder degradiert?
Was ist genau fehlgeschlagen?
Wie teuer ist EFRO pro Shop?
Welches Problem muss zuerst behoben werden?
Kernansichten
1. Ops

Pro Shop:

Shop-Domain
Plan
Installationsstatus
aktiv / inaktiv
letzte Aktivität
letzter erfolgreicher Produkt-Sync
letzte erfolgreiche Widget-Session
letzte erfolgreiche Chat-Antwort
letzte Warnung / letzter Fehler
Health Score
Statusfarbe: Grün / Gelb / Rot
2. Katalog

Pro Shop:

Gesamtzahl Produkte
Zahl verkaufbarer Produkte
potenzielle Duplikate
Produkte ohne Bild
Produkte ohne Preis
Produkte ohne Kategorie / Product Type
Warnung bei veraltetem Sync
fehlerhafte Produktlinks / Handles
3. Voice & Kosten

Pro Shop:

gesamte Brain-Requests
Brain-Cache-Hits
gesamte TTS-Requests
TTS-Cache-Hits
geschätzte Sprechsekunden
geschätzte ElevenLabs-Kosten
geschätzte MascotBot-Kosten
Kosten pro Tag / 7 Tage / 30 Tage
Anomalie-Warnung bei Voice-Spitzen
4. Alerts

Pro Shop:

kein erfolgreicher Sync seit N Stunden
keine Produkte oder verdächtig niedrige Produktzahl
Session-Token-Check fehlgeschlagen
wiederholte Widget-Startfehler
wiederholte Brain-Fehler
sichtbare doppelte Produkte
ungewöhnlicher Kostensprung
Shop inaktiv / deinstalliert / Token fehlt
Minimale Datenquellen

Das Control Center soll Daten zusammenführen aus:

efro_shops
products
cache_responses
cache_audio
efro_action_log
Shopify-Server-Events für Auth / Installation / Webhooks
Widget-Events für Chat / Voice / Fehler
nächtliche Ollama-Zusammenfassungen und Risikobewertungen
Einheitliches Ereignismodell

Jedes kritische Ereignis soll auf ein einheitliches Ops-Format normalisiert werden:

{
  "ts": "ISO-8601",
  "env": "prod|staging|dev",
  "shop": "shop-domain",
  "component": "brain|shopify|widget|voice|cache|catalog|ops",
  "event": "short_machine_name",
  "ok": true,
  "severity": "info|warn|error",
  "trace_id": "uuid-or-correlation-id",
  "ms": 0,
  "meta": {}
}
Ziel-Health-Score

Ein einzelner Shop-Health-Score soll berechnet werden aus:

Installationsstatus
Frische des Syncs
Katalogqualität
Erfolgsrate der Antworten
Cache-Effizienz
Voice-Zuverlässigkeit
Zahl offener Alerts
Kostenanomalien

Bewertung:

90-100 = Grün
70-89 = Gelb
0-69 = Rot
Sofortige Nicht-Ziele

Vor Abschluss der Shopify-Prüfung machen wir nicht:

vollständigen Ersatz von MascotBot
vollständigen Ersatz von ElevenLabs
kompletten Website-Relaunch
Landingpage-Feinschliff vor operativer Transparenz
Operative Prioritäten
Zuerst Sichtbarkeit schaffen.
Danach Kostenkontrolle aufbauen.
Danach Automatisierung hinzufügen.
Danach Ersatzarchitektur ausbauen.
Rolle von Ollama im Control Center

Ollama ist nicht zuerst der Live-Verkäufer. Ollama ist zuerst das Überwachungs- und Diagnose-Gehirn.

Ollama-Aufgaben
Vorfallszusammenfassungen
nächtliche Shop-Audits
ähnliche Fehler gruppieren
Shops nach Risiko priorisieren
wahrscheinliche Ursachen aus Logs und Metriken erklären
konkrete Reihenfolge für Fixes vorschlagen
Phase-1-Ergebnis

Phase 1 ist erst dann fertig, wenn:

alle installierten Shops in einem Dashboard sichtbar sind
jeder Shop Status und letzte Aktivität hat
letzter Sync und letzter Fehler pro Shop sichtbar sind
kostenrelevante Zähler sichtbar sind
kaputte Shops ohne manuelles Suchen auffallen