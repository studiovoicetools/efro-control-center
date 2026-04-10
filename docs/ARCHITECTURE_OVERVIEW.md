# Architecture Overview

## Ziel
Professionelle, wartbare und produktionsfähige Gesamtarchitektur für EFRO mit klaren Zuständigkeiten pro Repo, stabilen Schnittstellen und nachvollziehbaren Laufzeitflüssen.

## Derzeit belegte Repos
- efro
- efro-widget
- efro-brain
- efro-shopify

## Aktueller belegter Ist-Zustand

### efro-widget
- dedizierter Widget-/Avatar-Client
- spricht direkt mit efro-brain über /api/brain/chat
- besitzt eigene Signed-URL-Route für Mascot/ElevenLabs
- startet Session und verdrahtet MascotClient/MascotRive

### efro-brain
- eigenständiger Brain-Service mit POST /api/brain/chat
- nutzt Supabase für Produkte, Sprache, Cache, Events und Conversations
- verarbeitet Anfragen über BrainOrchestrator, IntentDetector, ProductFilter und ResponseBuilder
- fällt ohne injizierte Produkte auf ein Snapshot-JSON zurück

### efro-shopify
- eigenständige Shopify-App für OAuth, Produktsync, Webhooks, Privacy/GDPR und Brain-Proxy
- enthält server.js, webhooks.js, web/index.js, web/privacy.js und web/shopify.js als belegte Runtime-Pfade

### efro
- eigene Haupt-App mit Brain-/Produkt-/Shopify-nahen Pfaden
- bleibt damit architektonisch relevant und kann nicht als reine Doku- oder Altlast-Schicht behandelt werden

## Zentrale Architektur-Risiken
- unklare Haupt-UI-Grenze zwischen efro und efro-widget
- Brain-Produktquelle ist nicht konsistent eindeutig live, da Snapshot-Fallback existiert
- Shopify-/Commerce-Gesamtfluss ist zwar auf Dateiebene belegt, aber noch nicht als endgültiger Zielpfad festgelegt
- ENV-/Secret-Grenzen sind noch nicht sauber genug, insbesondere bei potenziell public-exponierten Namen
- mehrere Repos sind nicht clean und enthalten Backup-/Nebenartefakte

## Was aktuell noch nicht als endgültige SSOT gilt
- dass efro-widget die einzige produktive Haupt-UI ist
- dass efro die endgültige Hauptanwendung bleibt
- dass efro-brain in Produktion immer mit live injizierten Produkten arbeitet
- dass efro-shopify allein die finale Commerce-Wahrheit ist

## Vorläufiges Zielbild
- efro-widget = widget-/avatar-/voice-client
- efro-brain = zentraler Entscheidungs- und Antwortservice
- efro-shopify = installation, oauth, webhook, sync, privacy, shop-nahe integration
- efro = host-/admin-/data-layer oder klar definierte haupt-app, aber nicht beides unscharf parallel

## Ziel nach Abschluss des Architekturaufbaus
- jede Kernfunktion hat genau eine klar benannte Wahrheit
- jeder kritische Laufzeitfluss ist dokumentiert
- jede ENV-Variable ist dokumentiert und einem Scope zugeordnet
- jeder kritische Bug ist einem Root Cause zugeordnet
- Go-Live-Kriterien sind objektiv prüfbar

## park-update 2026-03-26

### bestätigter zwischenstand
- voice-agent und chat wurden näher an dieselbe wahrheit gebracht
- ein aktiver tool-endpoint unter `pages/api/tool/search-products.ts` existiert
- der bisherige harte konflikt "voice sagt etwas anderes als chat" ist deutlich reduziert

### noch nicht akzeptierte endlösung
- aktuelle filter-/intent-fixes sind nicht als finale scale-architektur freigegeben
- für millionen shops und millionen produkte ist eine generische retrieval-/ranking-architektur erforderlich
- bad products bleiben teil des systems und müssen intelligent behandelt werden

### nächstes zielbild
- kanonischer produkt-retrieval-pfad für chat und voice
- retrieval + ranking + hygiene handling statt shop-/kategorie-hardcoding
- catalog-audit und customer-facing ranking als getrennte, saubere verantwortungen

## park-update 2026-03-26

### bestätigter zwischenstand
- voice-agent und chat wurden näher an dieselbe wahrheit gebracht
- ein aktiver tool-endpoint unter `pages/api/tool/search-products.ts` existiert
- der bisherige harte konflikt "voice sagt etwas anderes als chat" ist deutlich reduziert

### noch nicht akzeptierte endlösung
- aktuelle filter-/intent-fixes sind nicht als finale scale-architektur freigegeben
- für millionen shops und millionen produkte ist eine generische retrieval-/ranking-architektur erforderlich
- bad products bleiben teil des systems und müssen intelligent behandelt werden

### nächstes zielbild
- kanonischer produkt-retrieval-pfad für chat und voice
- retrieval + ranking + hygiene handling statt shop-/kategorie-hardcoding
- catalog-audit und customer-facing ranking als getrennte, saubere verantwortungen

## brain redesign note — 2026-03-26
der aktuelle brain-stand ist nicht als finale millionen-shops-/millionen-produkte-architektur freigegeben.
die naechste umsetzung soll auf einem gemeinsamen, skalierbaren retrieval-kern basieren.
siehe:
- /root/work/efro-control-center/docs/BRAIN_SCALE_REDESIGN_2026-03-26.md
