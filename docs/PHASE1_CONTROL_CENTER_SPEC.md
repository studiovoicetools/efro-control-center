Phase 1 Spezifikation — Control Center MVP

Stand: 2026-03-28

Ziel

Das erste echte Operator-Dashboard für EFRO bauen.

MVP-Umfang

Phase 1 muss klein, schnell und operativ nützlich sein.

Exakte MVP-Screens
Screen A — Shop-Übersicht

Tabellenspalten:

shop_domain
plan
status
installed_at
last_seen_at
product_count
last_sync_at
last_error
health_score
estimated_cost_24h

Aktionen:

Shop-Detail öffnen
nach Status filtern
nach Plan filtern
nach Health / Kosten / letzter Aktivität sortieren
Screen B — Shop-Detail

Sektionen:

Installation / Auth-Status
Sync-Status
Katalogqualität
Brain-Status
Widget- / Voice-Status
letzte Events
offene Alerts
Kosten-Snapshot
Screen C — Alerts Queue

Liste ungelöster Probleme:

kaputte Installation
veralteter Sync
keine Produkte
verdächtig niedrige Produktanzahl
doppelte Produkte
Voice deaktiviert oder fehlerhaft
wiederholte Chat-Fehler
Kostenanstieg
MVP-Datenmodell

Zu normalisieren oder neu anzulegen:

ops_shop_metrics
ops_shop_alerts
ops_events
ops_shop_metrics

Vorgeschlagene Felder:

shop_domain
ts
product_count
sellable_product_count
duplicate_candidate_count
last_sync_at
last_chat_at
brain_request_count_24h
brain_cache_hit_count_24h
tts_request_count_24h
tts_cache_hit_count_24h
estimated_spoken_seconds_24h
estimated_cost_24h
health_score
ops_shop_alerts

Vorgeschlagene Felder:

id
shop_domain
severity
code
title
detail
status
first_seen_at
last_seen_at
resolved_at
ops_events

Vorgeschlagene Felder:

id
ts
env
shop_domain
component
event
ok
severity
trace_id
duration_ms
meta_json
Erste Alert-Regeln

Als Erstes implementieren:

kein erfolgreicher Sync seit 12h
product_count = 0
product_count deutlich unter historischem Normalwert
duplicate_candidate_count > 0
wiederholte Widget-Startfehler
wiederholte Brain-Fehler
Kostensprung über Schwellenwert
zu niedrige Cache-Hit-Rate
Notwendige Berechnungen
Health Score
geschätzte Kosten pro Shop
Frische der letzten Aktivität
Zahl potenzieller Duplikate
Erkennung veralteter Syncs
UI-Leitlinien
kompakte, operatororientierte UI
zuerst Übersicht, nicht Dekoration
schnelle Scanbarkeit ist wichtiger als Animation
Rot / Gelb / Grün muss sofort sichtbar sein
jeder Alert braucht eine klare Erklärung in Alltagssprache
Bau-Reihenfolge für Phase 1
DB-Shape definieren
Read-APIs bauen
Overview-Seite bauen
Shop-Detail-Seite bauen
Alert-Erzeugung verdrahten
Kostenzähler verdrahten
mit echten Dev-Shop-Daten validieren
Done-Definition für Phase 1

Phase 1 ist fertig, wenn der EFRO-Operator in unter 60 Sekunden beantworten kann:

welche Shops kaputt sind
welche Shops teuer sind
welche Shops einen veralteten Katalog haben
welches Problem zuerst behoben werden muss