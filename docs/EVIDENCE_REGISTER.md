# Evidence Register

## Zweck
Sammlung harter Belege für Architektur-Aussagen, Laufzeitpfade und SSOT-Festlegungen.

## Eintragsformat
- Datum
- Thema
- Repo
- Datei/Pfad
- Befehl oder Belegart
- Kernaussage
- Status: Belegt / Widerlegt / Offen

## Evidenz

- Datum: 2026-03-25
- Thema: Widget UI Entry Point
- Repo: efro-widget
- Datei/Pfad: /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- Befehl oder Belegart: grep runtime-only
- Kernaussage: Die Datei ist ein echter Widget-UI-Entry-Point und enthält Widget-/Avatar-Logik.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Widget spricht direkt mit Brain API
- Repo: efro-widget
- Datei/Pfad: /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- Befehl oder Belegart: grep runtime-only auf apiUrl und /api/brain/chat
- Kernaussage: Das Widget setzt standardmäßig https://efro-brain.vercel.app und ruft ${apiUrl}/api/brain/chat auf.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Signed-URL-Aufruf im Widget
- Repo: efro-widget
- Datei/Pfad: /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- Befehl oder Belegart: grep runtime-only auf /api/get-signed-url
- Kernaussage: Das Widget ruft /api/get-signed-url per fetch auf.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Session-Start im Widget
- Repo: efro-widget
- Datei/Pfad: /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- Befehl oder Belegart: grep runtime-only auf conversation.startSession
- Kernaussage: Das Widget startet eine Conversation-Session mit signedUrl und dynamicVariables.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Mascot Inputs im Widget
- Repo: efro-widget
- Datei/Pfad: /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- Befehl oder Belegart: grep runtime-only auf MascotClient / inputs
- Kernaussage: MascotClient ist mit den Inputs is_speaking und gesture verdrahtet.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Signed-URL-Route vorhanden
- Repo: efro-widget
- Datei/Pfad: /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts
- Befehl oder Belegart: grep runtime-only auf get-signed-url
- Kernaussage: Es existiert eine echte API-Route für Signed-URL-Handling.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Signed-URL-Route liest Secrets serverseitig
- Repo: efro-widget
- Datei/Pfad: /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts
- Befehl oder Belegart: process.env-Lesestellen
- Kernaussage: Die Route liest MASCOT_BOT_API_KEY, ELEVENLABS_AGENT_ID und ELEVENLABS_API_KEY serverseitig.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Brain API Entry Point
- Repo: efro-brain
- Datei/Pfad: /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts
- Befehl oder Belegart: app/api entrypoints + Dateiinhalt
- Kernaussage: Es existiert ein produktiver Brain-API-Entry-Point unter pages/api/brain/chat.ts.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Brain-Handler nutzt Supabase und Response-Cache
- Repo: efro-brain
- Datei/Pfad: /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts
- Befehl oder Belegart: Dateiinhalt
- Kernaussage: Der Handler liest SUPABASE_URL und SUPABASE_SERVICE_KEY / SUPABASE_SERVICE_ROLE_KEY, nutzt cache_responses, conversations und events.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Brain-Handler normalisiert Request-Vertrag
- Repo: efro-brain
- Datei/Pfad: /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts
- Befehl oder Belegart: Dateiinhalt
- Kernaussage: Der Handler akzeptiert message oder userQuery sowie shop_domain oder shopDomain und erzeugt sessionId-Fallback.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Brain-Orchestrator verwendet Kernmodule
- Repo: efro-brain
- Datei/Pfad: /opt/efro-agent/repos/efro-brain/src/brain/orchestrator/index.ts
- Befehl oder Belegart: Dateiinhalt
- Kernaussage: Der Orchestrator nutzt IntentDetector, ProductFilter und ResponseBuilder und erzeugt recommendations plus replyText.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Brain-Orchestrator hat Snapshot-Fallback
- Repo: efro-brain
- Datei/Pfad: /opt/efro-agent/repos/efro-brain/src/brain/orchestrator/index.ts
- Befehl oder Belegart: Dateiinhalt
- Kernaussage: Wenn keine Produkte injiziert werden, lädt der Orchestrator aus src/data/shopify_products_snapshot.json.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Shopify-App Server vorhanden
- Repo: efro-shopify
- Datei/Pfad: /opt/efro-agent/repos/efro-shopify/server.js
- Befehl oder Belegart: grep runtime-only
- Kernaussage: Das Repo enthält einen produktiven Server mit OAuth-, Sync- und Webhook-Logik.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Shopify-Server liest zentrale ENVs
- Repo: efro-shopify
- Datei/Pfad: /opt/efro-agent/repos/efro-shopify/server.js
- Befehl oder Belegart: grep runtime-only auf process.env
- Kernaussage: server.js liest u. a. SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_APP_SCOPES, SHOPIFY_APP_URL, BRAIN_API_URL, SUPABASE_URL und SUPABASE_SERVICE_KEY / SUPABASE_SERVICE_ROLE_KEY.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Webhook-Registrierung im Shopify-Server
- Repo: efro-shopify
- Datei/Pfad: /opt/efro-agent/repos/efro-shopify/server.js
- Befehl oder Belegart: grep runtime-only auf registerWebhooks / app.post('/webhooks')
- Kernaussage: Der Server registriert Webhooks für app/uninstalled, products/* und GDPR-Endpunkte und besitzt dazu konkrete app.post-Handler.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Order-Webhook-Logik vorhanden
- Repo: efro-shopify
- Datei/Pfad: /opt/efro-agent/repos/efro-shopify/webhooks.js
- Befehl oder Belegart: grep runtime-only auf validateWebhookHmac / handleOrdersCreateWebhook
- Kernaussage: Das Repo enthält dedizierte HMAC-Validierung und Order-Webhook-Verarbeitung mit Brain-API-Bezug.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Privacy-Webhooks vorhanden
- Repo: efro-shopify
- Datei/Pfad: /opt/efro-agent/repos/efro-shopify/web/privacy.js
- Befehl oder Belegart: grep runtime-only
- Kernaussage: Das Repo enthält Shopify-Privacy-Webhook-Definitionen mit callbackUrl /api/webhooks.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Brain-Proxy im Shopify-Repo
- Repo: efro-shopify
- Datei/Pfad: /opt/efro-agent/repos/efro-shopify/web/index.js
- Befehl oder Belegart: grep runtime-only auf brainProxy
- Kernaussage: Das Repo proxyt Brain-Verarbeitung unter /efro-api/brain/process.
- Status: Belegt

- Datum: 2026-03-25
- Thema: Haupt-App efro bleibt aktiv relevant
- Repo: efro
- Datei/Pfad: /opt/efro-agent/repos/efro/src/app/page.tsx
- Befehl oder Belegart: grep runtime-only
- Kernaussage: Das Repo efro besitzt eine eigene Haupt-App und trägt data-efro-brain-url="https://efro-brain.vercel.app".
- Status: Belegt

- Datum: 2026-03-25
- Thema: efro nutzt eigene Produkt- und Shopify-Pfade
- Repo: efro
- Datei/Pfad: /opt/efro-agent/repos/efro/src/components/CrossSellingSuggestions.tsx, /opt/efro-agent/repos/efro/src/lib/products/efroProductLoader.ts, /opt/efro-agent/repos/efro/src/lib/shopify.ts
- Befehl oder Belegart: grep runtime-only
- Kernaussage: efro ruft /api/shopify-products auf und enthält eigene Shopify- sowie Produktlade-Logik.
- Status: Belegt

## Regel
Ohne Eintrag hier darf eine kritische Architekturbehauptung nicht als endgültig gelten.

- Datum: 2026-03-26
- Thema: Voice-Tool-Endpoint aktiv
- Repo: efro-brain
- Datei/Pfad: /opt/efro-agent/repos/efro-brain/pages/api/tool/search-products.ts
- Befehl oder Belegart: aktiver preview/live curl-test
- Kernaussage: Der frühere tote voice-tool-endpoint wurde als aktive runtime-route wiederhergestellt und liefert gültiges JSON.
- Status: Belegt

- Datum: 2026-03-26
- Thema: DB enthält snowboard-produkte
- Repo: efro-brain
- Datei/Pfad: products-tabelle / avatarsalespro-dev.myshopify.com
- Befehl oder Belegart: serverseitiger supabase-check
- Kernaussage: Die db enthält echte snowboard-produkte; das problem ist daher nicht mehr "kein bestand", sondern ranking/normalisierung.
- Status: Belegt

- Datum: 2026-03-26
- Thema: scale-architektur noch offen
- Repo: efro-brain
- Datei/Pfad: src/brain/modules/IntentDetector.ts, src/brain/modules/ProductFilter.ts
- Befehl oder Belegart: code-review + testlauf
- Kernaussage: Der aktuelle patch ist zwischenstand und nicht als finale millionen-shops-/millionen-produkte-architektur akzeptiert.
- Status: Belegt

- Datum: 2026-03-26
- Thema: Voice-Tool-Endpoint aktiv
- Repo: efro-brain
- Datei/Pfad: /opt/efro-agent/repos/efro-brain/pages/api/tool/search-products.ts
- Befehl oder Belegart: aktiver preview/live curl-test
- Kernaussage: Der frühere tote voice-tool-endpoint wurde als aktive runtime-route wiederhergestellt und liefert gültiges JSON.
- Status: Belegt

- Datum: 2026-03-26
- Thema: DB enthält snowboard-produkte
- Repo: efro-brain
- Datei/Pfad: products-tabelle / avatarsalespro-dev.myshopify.com
- Befehl oder Belegart: serverseitiger supabase-check
- Kernaussage: Die db enthält echte snowboard-produkte; das problem ist daher nicht mehr "kein bestand", sondern ranking/normalisierung.
- Status: Belegt

- Datum: 2026-03-26
- Thema: scale-architektur noch offen
- Repo: efro-brain
- Datei/Pfad: src/brain/modules/IntentDetector.ts, src/brain/modules/ProductFilter.ts
- Befehl oder Belegart: code-review + testlauf
- Kernaussage: Der aktuelle patch ist zwischenstand und nicht als finale millionen-shops-/millionen-produkte-architektur akzeptiert.
- Status: Belegt
