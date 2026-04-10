# Runtime Flows

## Zweck
Dokumentation aller produktionskritischen End-to-End-Flows.

## Flow 1: Widget → Brain → Antwort
Status:
- Teilweise belegt

Startpunkt:
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx

Belegte Schritte:
1. page.tsx setzt `apiUrl` standardmäßig auf `https://efro-brain.vercel.app`
2. page.tsx kann `apiUrl` über `window.EFRO_BRAIN_URL` überschreiben
3. page.tsx ruft `${apiUrl}/api/brain/chat` auf
4. /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts verarbeitet POST-Requests
5. der Handler akzeptiert `message` oder `userQuery` sowie `shop_domain` oder `shopDomain`
6. der Handler verwendet `BrainOrchestrator` und gibt `reply`, `response`, `replyText` und `products` zurück

Beteiligte Dateien:
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts
- /opt/efro-agent/repos/efro-brain/src/brain/orchestrator/index.ts

Offen:
- kompletter Browser-Laufzeitbeweis
- genaue Produktquelle pro produktivem Request

## Flow 2: Widget → Signed URL → Session-Start → Mascot
Status:
- Teilweise belegt

Startpunkt:
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx

Belegte Schritte:
1. page.tsx rendert MascotClient und MascotRive
2. page.tsx ruft `/api/get-signed-url` per fetch auf
3. /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts liest MASCOT_BOT_API_KEY, ELEVENLABS_AGENT_ID und ELEVENLABS_API_KEY
4. route.ts ruft `https://api.mascot.bot/v1/get-signed-url` auf
5. page.tsx startet `conversation.startSession({ signedUrl, dynamicVariables })`
6. MascotClient ist mit `is_speaking` und `gesture` verdrahtet

Beteiligte Dateien:
- /opt/efro-agent/repos/efro-widget/src/app/page.tsx
- /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts

Offen:
- sichtbarer End-to-End-Lipsync-Beweis
- Fehlerfall- und Recovery-Verhalten
- Beweis, dass `is_speaking` im echten Lauf sauber toggelt

## Flow 3: Brain intern → Intent → Filter → Response
Status:
- Belegt auf Dateiebene, end-to-end teilweise offen

Startpunkt:
- /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts

Belegte Schritte:
1. der Handler erzeugt `shopDomain`, `query` und `session`
2. der Handler verwendet Supabase für Sprache, Produkte, Cache, Events und Conversations
3. `BrainOrchestrator` nutzt `IntentDetector`, `ProductFilter` und `ResponseBuilder`
4. das Ergebnis enthält Recommendations, ReplyText, Context, Metadata und Debug

Beteiligte Dateien:
- /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts
- /opt/efro-agent/repos/efro-brain/src/brain/orchestrator/index.ts
- /opt/efro-agent/repos/efro-brain/src/brain/modules/IntentDetector.ts
- /opt/efro-agent/repos/efro-brain/src/brain/modules/ProductFilter.ts

Offen:
- endgültige Live-Produktquelle pro Request
- klare Trennung zwischen Snapshot-Fallback und injizierten Produkten

## Flow 4: Shopify-App → OAuth / Sync / Webhooks / Privacy
Status:
- Belegt auf Dateiebene

Startpunkt:
- /opt/efro-agent/repos/efro-shopify/server.js

Belegte Schritte:
1. server.js liest Shopify-, Supabase- und Brain-ENVs
2. server.js setzt Raw-Body für `/webhooks`
3. server.js führt `syncProducts(shopDomain, accessToken)` aus
4. server.js registriert Webhooks über `registerWebhooks(...)`
5. server.js definiert konkrete Webhook-Handler für `app/uninstalled`, `products/create`, `products/update`, `products/delete`, `customers/data_request`, `customers/redact`, `shop/redact`
6. webhooks.js enthält HMAC-Validierung und Order-Webhook-Verarbeitung
7. web/privacy.js definiert Privacy-Webhooks mit `callbackUrl: "/api/webhooks"`
8. web/index.js proxyt Brain-Verarbeitung unter `/efro-api/brain/process`

Beteiligte Dateien:
- /opt/efro-agent/repos/efro-shopify/server.js
- /opt/efro-agent/repos/efro-shopify/webhooks.js
- /opt/efro-agent/repos/efro-shopify/web/index.js
- /opt/efro-agent/repos/efro-shopify/web/privacy.js
- /opt/efro-agent/repos/efro-shopify/web/shopify.js

Offen:
- finaler produktiver Commerce-Pfad im Gesamtsystem
- exakte Abgrenzung zu efro-internen Produkt-/Shopify-Pfaden

## Flow 5: efro Hauptanwendung → Brain-/Produktpfade
Status:
- Teilweise belegt

Startpunkt:
- /opt/efro-agent/repos/efro/src/app/page.tsx

Belegte Schritte:
1. efro enthält eigene Haupt-App
2. efro enthält `data-efro-brain-url="https://efro-brain.vercel.app"`
3. efro ruft `/api/shopify-products`, `/api/landing-chat` und `/api/supabase-products` auf
4. efro besitzt eigene Produktlade- und Shopify-Libs

Beteiligte Dateien:
- /opt/efro-agent/repos/efro/src/app/page.tsx
- /opt/efro-agent/repos/efro/src/components/CrossSellingSuggestions.tsx
- /opt/efro-agent/repos/efro/src/components/landing/EfroSalesWidget.tsx
- /opt/efro-agent/repos/efro/src/lib/products/efroProductLoader.ts
- /opt/efro-agent/repos/efro/src/lib/shopify.ts

Offen:
- ob efro die Haupt-UI bleibt oder nur Admin-/Host-/Data-Layer ist
