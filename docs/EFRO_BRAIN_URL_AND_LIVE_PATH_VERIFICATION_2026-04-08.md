# EFRO Brain URL and Live Path Verification

Stand: 2026-04-08

## Zweck
Diese Datei hält nur die direkt verifizierten Befunde zu
- produktiver Brain-URL
- aktivem Widget→Brain-Pfad
- Shopify→Brain-Pfad
- Live-vs-Shadow-Drift

fest.

---

## 1. Direkt verifizierter Widget→Brain-Pfad

### Quelle: `efro-widget/src/app/page.tsx`
Direkt verifiziert per Dateilesung und zusätzlicher Code-Suche:
- Default `apiUrl`: `https://efro-brain.vercel.app`
- `fallbackBrainUrl`: `https://efro-brain.vercel.app`
- Textpfad:
  - `${apiUrl}/api/brain/chat`
- TTS-Pfad:
  - `${apiUrl}/api/tts-with-visemes`
- Voice-Input ruft am Ende ebenfalls `sendMessage(...)` und damit denselben Textpfad auf

### Direkte Aussage
Das aktive Widget nutzt aktuell **nicht** den Shadow-Pfad, sondern:
- Text/Voice → `/api/brain/chat`
- TTS → `/api/tts-with-visemes`

---

## 2. Direkt verifizierter Brain-Live-vs-Shadow-Drift

### Quelle: `efro-brain/pages/api/brain/chat.ts`
Direkt verifiziert:
- aktiver Next-API-Handler vorhanden
- `runRetrieval(...)`
- Cache / Event / Conversation Logging aktiv
- Standardpfad für aktive Widget-Anfragen passend zum Widget-Vertrag

### Quelle: `efro-brain/pages/api/brain/chat-v2-shadow.ts`
Direkt verifiziert:
- aktiver Next-API-Handler vorhanden
- nutzt `BrainV2Orchestrator`
- liefert `debug.apiMode = 'brain_v2_shadow'`
- nutzt Retrieval-Diagnostics und Fallback-Retry

### Direkte Aussage
Direkt verifiziert ist:
- `chat.ts` und `chat-v2-shadow.ts` leben parallel
- das Widget spricht aktuell `chat.ts`
- der Shadow-Pfad ist aktiv vorhanden, aber nicht der aktuell direkt verifizierte Widget-Livepfad

---

## 3. Direkt verifizierter Shopify→Brain-Pfad

### Quelle: `efro-shopify/server.js`
Direkt verifiziert:
- `const BRAIN_API_URL = process.env.BRAIN_API_URL || 'https://efro-brain.vercel.app'`
- Full-Sync sendet an `${BRAIN_API_URL}/api/shopify/sync`

### Quelle: zusätzliche Code-Suche in `efro-shopify`
Direkt verifiziert:
- `server.js`: Default `https://efro-brain.vercel.app`
- `render.yaml`: `BRAIN_API_URL = https://efro-five.vercel.app`
- `README.md`: `BRAIN_API_URL=https://efro-five.vercel.app`
- `webhooks.js`: Fallback `https://efro-five.vercel.app`
- `web/frontend/utils/constants.js`: `https://efro-five.vercel.app`

### Direkte Aussage
`efro-shopify` enthält aktuell direkt verifizierbar **mindestens zwei Brain-URL-Wahrheiten**:
- `https://efro-brain.vercel.app`
- `https://efro-five.vercel.app`

---

## 4. Direkt verifizierte Brain-URL-Drifts über Repos hinweg

### `efro-widget`
Direkt verifiziert:
- Default/Fallback: `https://efro-brain.vercel.app`

### `efro-shopify`
Direkt verifiziert:
- `server.js` Default: `https://efro-brain.vercel.app`
- `render.yaml`: `https://efro-five.vercel.app`
- `README.md`: `https://efro-five.vercel.app`
- `webhooks.js`: `https://efro-five.vercel.app`
- `web/frontend/utils/constants.js`: `https://efro-five.vercel.app`

### Direkte Aussage
Es gibt aktuell **keine einzige direkt verifizierte, durchgehend konsistente Brain-URL-SSOT** im Repo-Bestand.

---

## 5. Direkt verifizierte operative Bedeutung

1. Widget-Liveverkehr spricht aktuell `/api/brain/chat`, nicht den Shadow-Pfad.
2. Shadow/BrianV2 existiert aktiv, ist aber nicht gleichbedeutend mit dem direkt verifizierten Livepfad.
3. Shopify-Sync kann je nach Konfigurationsquelle gegen unterschiedliche Brain-Hosts laufen.
4. Brain-URL-Drift ist aktuell kein hypothetisches Risiko, sondern direkt im Code- und Deploy-Bestand belegt.

---

## 6. Direkt sinnvolle nächste Schritte

1. genau eine produktive Brain-URL als SSOT festlegen
2. Widget / Shopify / Deploy-Konfiguration dagegen prüfen
3. `chat.ts` vs `chat-v2-shadow.ts` explizit als live vs shadow dokumentieren
4. erst danach weitere Integrations- oder Performance-Aussagen treffen

---

## 7. Kurzfazit

Direkt verifiziert ist:
- der aktive Widget-Livepfad geht auf `/api/brain/chat`
- `chat-v2-shadow.ts` ist aktiv vorhanden, aber nicht der direkt verifizierte Widget-Livepfad
- `efro-shopify` und `efro-widget` tragen aktuell keinen einheitlichen Brain-URL-Stand durch den Code-/Deploy-Bestand
