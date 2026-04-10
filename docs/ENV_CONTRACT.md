# ENV Contract

## Zweck
Zentrale Definition aller relevanten ENV-Variablen, ihres Scopes und ihres Sicherheitsniveaus.

## Regeln
- keine Secrets im Frontend
- keine unklare Mehrfachnutzung ohne Doku
- jede ENV-Variable braucht Besitzer, Zweck und Scope
- jede Runtime-ENV muss einem Repo zugeordnet sein
- .env-Dateien dienen nur zum Auffinden von Namen, nicht als Beleg für Runtime-Lesestellen

## Belegte Runtime-Lesestellen

| Name | Repo | Exakte Runtime-Lesestelle | Zweck | Scope | Status |
|---|---|---|---|---|---|
| MASCOT_BOT_API_KEY | efro-widget | /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts | Auth für Mascot Signed-URL-Request | server only | Belegt |
| ELEVENLABS_AGENT_ID | efro-widget | /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts | Agent-ID für Voice-/Mascot-Integration | server only | Belegt |
| ELEVENLABS_API_KEY | efro-widget | /opt/efro-agent/repos/efro-widget/src/app/api/get-signed-url/route.ts | Auth für ElevenLabs-Integration | server only | Belegt |
| SUPABASE_URL | efro-brain | /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts | Supabase-Verbindung für Sprache, Produkte, Cache, Events, Conversations | server only | Belegt |
| SUPABASE_SERVICE_KEY | efro-brain | /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts | privilegierter Supabase-Zugriff | server only | Belegt |
| SUPABASE_SERVICE_ROLE_KEY | efro-brain | /opt/efro-agent/repos/efro-brain/pages/api/brain/chat.ts | Fallback für privilegierten Supabase-Zugriff | server only | Belegt |
| PORT | efro-shopify | /opt/efro-agent/repos/efro-shopify/server.js | Server-Port | server only | Belegt |
| SHOPIFY_API_KEY | efro-shopify | /opt/efro-agent/repos/efro-shopify/server.js | OAuth-/App-Identifikation | server only | Belegt |
| SHOPIFY_API_SECRET | efro-shopify | /opt/efro-agent/repos/efro-shopify/server.js | OAuth-/Webhook-HMAC | server only | Belegt |
| SHOPIFY_APP_SCOPES | efro-shopify | /opt/efro-agent/repos/efro-shopify/server.js | App-Scopes | server only | Belegt |
| SHOPIFY_APP_URL | efro-shopify | /opt/efro-agent/repos/efro-shopify/server.js | Basis-URL der Shopify-App | server only | Belegt |
| BRAIN_API_URL | efro-shopify | /opt/efro-agent/repos/efro-shopify/server.js, /opt/efro-agent/repos/efro-shopify/webhooks.js | Brain-API-Ziel für Sync-/Webhook-nahe Calls | server only | Belegt |
| SUPABASE_URL | efro-shopify | /opt/efro-agent/repos/efro-shopify/server.js, /opt/efro-agent/repos/efro-shopify/webhooks.js | Supabase-Verbindung | server only | Belegt |
| SUPABASE_SERVICE_KEY | efro-shopify | /opt/efro-agent/repos/efro-shopify/server.js | privilegierter Supabase-Zugriff | server only | Belegt |
| SUPABASE_SERVICE_ROLE_KEY | efro-shopify | /opt/efro-agent/repos/efro-shopify/server.js | Fallback für privilegierten Supabase-Zugriff | server only | Belegt |
| SUPABASE_KEY | efro-shopify | /opt/efro-agent/repos/efro-shopify/webhooks.js | Supabase-Zugriff in Webhook-Logik | server only | Belegt |

## Weitere bekannte, aber architektonisch heikle oder noch unbestätigte Namen

| Name | Hinweis | Status |
|---|---|---|
| NEXT_PUBLIC_MASCOT_BOT_API_KEY | lokal als Key-Name vorhanden; muss gegen echte Client-Nutzung geprüft werden | Unbestätigt / Security-Warnhinweis |
| NEXT_PUBLIC_SUPABASE_URL | als Name bekannt, konkrete produktive Lesestelle in diesem SSOT-Stand noch nicht nachgetragen | Teilweise offen |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | als Name bekannt, konkrete produktive Lesestelle in diesem SSOT-Stand noch nicht nachgetragen | Teilweise offen |
| SHOPIFY_STORE_DOMAIN | als Konfigurationsname bekannt, konkrete Runtime-Lesestelle in diesem SSOT-Stand noch nicht nachgetragen | Teilweise offen |

## Sicherheitsnotiz
Im Shopify-Repo wurden `.env` und `.env.example` mit echten Secret-Werten angezeigt. Diese Werte sollten nicht weiter verteilt werden und später rotiert werden. `.env.example` darf keine echten Secrets enthalten.

## Offene Prüffragen
- Welche NEXT_PUBLIC-Variablen sind wirklich nötig?
- Welche ENV-Namen sind Altlasten oder doppelt?
- Welche weiteren Runtime-Lesestellen in efro selbst sollen noch als SSOT ergänzt werden?
