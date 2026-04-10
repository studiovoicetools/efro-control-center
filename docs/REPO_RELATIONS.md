# Repo Relations

## Zweck
Beschreibung der Zuständigkeiten, Integrationspunkte und Abhängigkeiten zwischen den EFRO-Repos.

## Repo-Matrix

### efro
Zweck:
- Hauptanwendung mit eigener Next-App, Admin-/Demo-Flächen und eigener Produkt-/Shopify-naher Logik

Verantwortung:
- Haupt-App-Routing
- Produktzugriff über /api/shopify-products und /api/supabase-products
- Landing-/Admin-nahe API-Verwendung
- eigene Brain-Kopplung über data-efro-brain-url

Kritische Dateien:
- /opt/efro-agent/repos/efro/src/app/page.tsx
- /opt/efro-agent/repos/efro/src/components/CrossSellingSuggestions.tsx
- /opt/efro-agent/repos/efro/src/lib/products/efroProductLoader.ts
- /opt/efro-agent/repos/efro/src/lib/shopify.ts

Risiko:
- Überlappt funktional mit efro-widget bei UI-/Brain-Kopplung
- endgültige Rolle gegenüber efro-widget noch nicht scharf entschieden

Status:
- Belegt, aber architektonische Endabgrenzung noch offen

---

### efro-widget
Zweck:
- dedizierte Widget-UI, Avatar-/Voice-Client und Signed-URL-Startlogik

Verantwortung:
- Widget-UI-Entry-Point
- Brain-Aufruf an /api/brain/chat
- Signed-URL-Abruf
- Session-Start über conversation.startSession
- MascotClient/MascotRive-Integration

Kritische Dateien:
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts
- /opt/efro-agent/repos/efro-widget/src/app/layout.tsx

Risiko:
- Backup-Dateien im Repo erschweren Analyse
- sichtbarer End-to-End-Render ist noch nicht als Laufzeitbeweis dokumentiert

Status:
- Kernpfad belegt

---

### efro-brain
Zweck:
- Brain-Service für Anfrageverarbeitung, Produktfilterung, Antwortgenerierung, Cache und Logging

Verantwortung:
- POST /api/brain/chat
- Orchestrierung über BrainOrchestrator
- Intent-Erkennung
- Produktfilterung
- Response-Aufbau
- Supabase-basiertes Cache-/Event-/Conversation-Logging

Kritische Dateien:
- /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts
- /opt/efro-agent/repos/efro-brain/src/brain/orchestrator/index.ts
- /opt/efro-agent/repos/efro-brain/src/brain/modules/IntentDetector.ts
- /opt/efro-agent/repos/efro-brain/src/brain/modules/ProductFilter.ts

Risiko:
- Produktquelle ist aktuell nicht eindeutig „live“, weil der Orchestrator ohne übergebene Produkte auf ein Snapshot-JSON fällt
- exakter End-to-End-Vertrag zum Aufrufer noch nicht vollständig dokumentiert

Status:
- Belegt, aber Produktquellen- und Vertragsfrage offen

---

### efro-shopify
Zweck:
- Shopify-App für OAuth, Produktsync, Webhooks, Privacy/GDPR und Brain-Proxy

Verantwortung:
- Shopify OAuth / Installation
- Produktsynchronisation
- Webhook-Registrierung
- Webhook-Verarbeitung
- Privacy-/GDPR-Callbacks
- Brain-Proxy unter /efro-api/brain/process

Kritische Dateien:
- /opt/efro-agent/repos/efro-shopify/server.js
- /opt/efro-agent/repos/efro-shopify/webhooks.js
- /opt/efro-agent/repos/efro-shopify/web/index.js
- /opt/efro-agent/repos/efro-shopify/web/shopify.js
- /opt/efro-agent/repos/efro-shopify/web/privacy.js

Risiko:
- klare Grenze zu efro und efro-brain muss noch als Gesamtfluss dokumentiert werden
- Secrets/ENV-Hygiene muss separat geprüft werden

Status:
- Produktive Runtime-Pfade belegt

## Bisher belegte Übergabepunkte

1. efro-widget → efro-brain
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx setzt apiUrl standardmäßig auf https://efro-brain.vercel.app
- dieselbe Datei ruft ${apiUrl}/api/brain/chat auf

2. efro-widget → eigene Signed-URL-Route
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx ruft /api/get-signed-url auf
- /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts verarbeitet diesen Pfad serverseitig

3. efro-shopify → Brain
- /opt/efro-agent/repos/efro-shopify/web/index.js proxyt Brain-Aufrufe unter /efro-api/brain/process
- /opt/efro-agent/repos/efro-shopify/webhooks.js nutzt BRAIN_API_URL für Webhook-nahe Verarbeitung

4. efro-shopify → Shopify / Supabase
- /opt/efro-agent/repos/efro-shopify/server.js synchronisiert Produkte und registriert Webhooks
- /opt/efro-agent/repos/efro-shopify/webhooks.js nutzt Supabase und HMAC-Validierung

5. efro → Brain / Shopify-nahe Datenpfade
- /opt/efro-agent/repos/efro/src/app/page.tsx enthält data-efro-brain-url
- /opt/efro-agent/repos/efro/src/lib/products/efroProductLoader.ts und /opt/efro-agent/repos/efro/src/lib/shopify.ts sind produktive Datapfade

## Weiter offen
- welche UI wirklich „die“ produktive Hauptoberfläche ist: efro oder efro-widget
- ob efro-brain in Produktion überwiegend mit live injizierten Produkten oder mit Snapshot-Fallback arbeitet
- welcher Pfad für Commerce final maßgeblich ist: efro, efro-shopify oder beides
