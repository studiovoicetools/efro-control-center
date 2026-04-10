# Current Bugs

## Zweck
Zentrale Liste der aktuell bekannten Blocker, Risiken und Architektur-Schulden.

## Priorität P0

### P0-1: Widget sichtbar / Avatar sichtbar nicht end-to-end bewiesen
Beschreibung:
Der UI-Kernpfad in efro-widget ist auf Dateiebene belegt, aber die tatsächliche Sichtbarkeit von Chatfenster und Avatar im Browser ist noch nicht als Laufzeitbeweis dokumentiert.

Belegte Dateien:
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts

Status:
- Offen

Risiko:
- Sehr hoch

Nächster Schritt:
- echten Browser-/Laufzeitbeweis für Rendering, Provider-Kontext und sichtbaren Avatar dokumentieren

### P0-2: Voice / Signed-URL / Lipsync nur teilweise end-to-end belegt
Beschreibung:
Die Signed-URL-Route und die serverseitigen ENV-Lesestellen sind belegt. Die vollständige Sprach- und Lipsync-Kette ist jedoch noch nicht bis zur sichtbaren Laufzeitreaktion bewiesen.

Belegte Dateien:
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts

Status:
- Offen

Risiko:
- Sehr hoch

Nächster Schritt:
- Laufzeitbeweis für erfolgreiche Signed URL, Session-Start und tatsächliche Reaktion von is_speaking dokumentieren

### P0-3: Rollenabgrenzung zwischen efro und efro-widget noch unklar
Beschreibung:
Sowohl efro als auch efro-widget enthalten echte App-/Runtime-Pfade. Die endgültige produktive Zuständigkeit für UI, Produktladung und Integrationspfade ist noch nicht scharf genug getrennt.

Belegte Dateien:
- /opt/efro-agent/repos/efro/src/app/page.tsx
- /opt/efro-agent/repos/efro/src/lib/shopify.ts
- /opt/efro-agent/repos/efro/src/lib/products/efroProductLoader.ts
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx

Status:
- Offen

Risiko:
- Sehr hoch

Nächster Schritt:
- Zielarchitektur festlegen: welches Repo ist produktive Haupt-UI, welches nur Integrations-/Teilmodul

## Priorität P1

### P1-1: Brain-Endpunkt und Brain-Module vorhanden, aber Request-/Response-Vertrag noch unklar
Beschreibung:
Der Brain-API-Entry-Point und zentrale Brain-Module sind belegt. Der exakte Vertrag zwischen Aufrufer, Produkten, Filtern und Antwortobjekt ist noch nicht dokumentiert.

Belegte Dateien:
- /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts
- /opt/efro-agent/repos/efro-brain/src/brain/orchestrator/index.ts
- /opt/efro-agent/repos/efro-brain/src/brain/modules/IntentDetector.ts
- /opt/efro-agent/repos/efro-brain/src/brain/modules/ProductFilter.ts

Status:
- Offen

Risiko:
- Hoch

Nächster Schritt:
- echten Request-/Response-Vertrag und Produktquelle dokumentieren

### P1-2: Shopify-Repo vorhanden, aber produktive Commerce-/Webhook-Flows noch nicht ausreichend SSOT-belegt
Beschreibung:
Das Repo efro-shopify ist vorhanden, aber die produktiven Webhook-/Commerce-Flows sind im SSOT noch nicht sauber genug dokumentiert.

Belegte Hinweise:
- Repo vorhanden
- Shopify-App-Konfiguration vorhanden

Status:
- Offen

Risiko:
- Hoch

Nächster Schritt:
- server.js, webhooks.js, web/shopify.js und web/privacy.js gezielt als Laufzeitbelege nachtragen

### P1-3: ENV-/Security-Risiko durch public-exponierte Key-Namen
Beschreibung:
In der lokalen Konfiguration existiert der Key-Name NEXT_PUBLIC_MASCOT_BOT_API_KEY. Das ist ein starker Warnhinweis auf mögliches Secret-Leak-Risiko oder falsche Public/Server-Grenze.

Status:
- Offen

Risiko:
- Hoch

Nächster Schritt:
- prüfen, ob dieser Key irgendwo wirklich clientseitig verwendet wird; falls ja, Architektur bereinigen und Secret rotieren

## Priorität P2

### P2-1: Repos sind nicht clean
Beschreibung:
Mehrere Repos enthalten .bak-Dateien oder uncommittete Änderungen. Das erhöht Fehlerrisiko bei Analyse, Diffs und Agenten-Arbeit.

Betroffene Repos:
- efro
- efro-widget
- efro-brain
- efro-shopify

Status:
- Offen

Risiko:
- Mittel

Nächster Schritt:
- Backup-Dateien und unstaged Änderungen sauber inventarisieren und bereinigen

### P2-2: ENV Contract noch unvollständig
Beschreibung:
Bisher sind erst drei Runtime-Lesestellen in ENV_CONTRACT.md hart belegt. Weitere ENV-Lesestellen in efro und efro-shopify fehlen noch im SSOT.

Status:
- Offen

Risiko:
- Mittel

Nächster Schritt:
- weitere process.env-Lesestellen in produktiven Runtime-Dateien nachtragen

## park-update 2026-03-26

### P0-parkstand: voice und chat sprechen jetzt weitgehend dieselbe wahrheit
beschreibung:
der frühere widerspruch zwischen voice und chat wurde deutlich reduziert, nachdem der aktive tool-endpoint für den voice-agent wiederhergestellt wurde.

status:
- teilweise gelöst / zwischenstand

risiko:
- mittel

nächster schritt:
- keine weiteren prompt-only-fixes
- kanonische backend-wahrheit beibehalten

### P1-1: produktwahrheit noch nicht scale-fertig
beschreibung:
die aktuelle brain-/filter-logik ist als zwischenstand brauchbarer, aber nicht als endgültige architektur für millionen shops und millionen produkte akzeptiert.

status:
- offen

risiko:
- hoch

nächster schritt:
- scale-first retrieval/ranking-architektur statt weiterer hardcoded speziallogik

### P1-2: dirty catalog handling ist produktanforderung
beschreibung:
bad products sind absichtlich im katalog und müssen als crashtest erhalten bleiben. efro soll trotz schmutziger daten brauchbare treffer liefern und später verbesserungsvorschläge für den shopinhaber machen.

status:
- offen

risiko:
- hoch

nächster schritt:
- trennung zwischen customer-facing ranking und catalog-audit-logik architektonisch sauber aufbauen

## park-update 2026-03-26

### P0-parkstand: voice und chat sprechen jetzt weitgehend dieselbe wahrheit
beschreibung:
der frühere widerspruch zwischen voice und chat wurde deutlich reduziert, nachdem der aktive tool-endpoint für den voice-agent wiederhergestellt wurde.

status:
- teilweise gelöst / zwischenstand

risiko:
- mittel

nächster schritt:
- keine weiteren prompt-only-fixes
- kanonische backend-wahrheit beibehalten

### P1-1: produktwahrheit noch nicht scale-fertig
beschreibung:
die aktuelle brain-/filter-logik ist als zwischenstand brauchbarer, aber nicht als endgültige architektur für millionen shops und millionen produkte akzeptiert.

status:
- offen

risiko:
- hoch

nächster schritt:
- scale-first retrieval/ranking-architektur statt weiterer hardcoded speziallogik

### P1-2: dirty catalog handling ist produktanforderung
beschreibung:
bad products sind absichtlich im katalog und müssen als crashtest erhalten bleiben. efro soll trotz schmutziger daten brauchbare treffer liefern und später verbesserungsvorschläge für den shopinhaber machen.

status:
- offen

risiko:
- hoch

nächster schritt:
- trennung zwischen customer-facing ranking und catalog-audit-logik architektonisch sauber aufbauen

### P1-3: aktueller brain zwischenstand nicht als endlösung freigegeben
beschreibung:
die letzten fixes verbessern das aktuelle verhalten, sind aber nicht als final skalierbare architektur fuer sehr viele shops und kataloge akzeptiert.

status:
- offen

risiko:
- hoch

naechster schritt:
- gemeinsamen retrieval-kern designen und chat/voice auf dieselbe kanonische suchlogik umstellen
