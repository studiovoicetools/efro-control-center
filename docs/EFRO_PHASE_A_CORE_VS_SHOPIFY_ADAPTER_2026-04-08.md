# EFRO Phase A — Core vs Shopify Adapter

Stand: 2026-04-08

## Zweck
Diese Notiz startet Phase A offiziell:
- EFRO soll Shopify als starken Adapter behalten
- EFRO soll zusätzlich unabhängig vermarktbar werden
- dafür muss zuerst klar werden, was **Core** ist und was **Shopify Adapter** ist

---

## Direkt verifizierte Repo-Selbstbeschreibungen

### `efro/README.md`
Direkt verifiziert:
- Titel: `EFRO – AI Voice Sales Assistant for Shopify`
- EFRO wird als AI Voice Sales Assistant beschrieben, der sich in Shopify Stores integriert
- Architektur nennt weiterhin Frontend, Brain API und Shopify App im Gesamtbild

### `efro-brain/README.md`
Direkt verifiziert:
- Titel: `EFRO Brain API`
- Untertitel: `KI-Orchestrator für Shopify Produkt-Empfehlungen`
- README behauptet weiterhin Shopify-zentrische Ausrichtung
- zugleich haben wir im aktiven Code bereits generischere Chat-/TTS-Pfade verifiziert

### `efro-widget/README.md`
Direkt verifiziert:
- Titel: `ElevenLabs Avatar Integration Demo`
- Meta-seitig ist das Repo noch klar upstream-/Demo-geprägt
- gleichzeitig ist der aktive Runtime-Code bereits EFRO-spezifisch und produktnah

---

## Direkt verifizierte Rollenlage

### `efro-shopify`
Ist klar Shopify-Adapter:
- OAuth
- Callback
- Webhooks
- Produkt-Sync
- Shopify App-/Theme-/Admin-Kontext

### `efro-brain`
Ist gemischt:
- klarer EFRO-Kern für Chat / TTS / Retrieval
- aber noch Shopify-nahe Defaults und Katalogfelder

### `efro-widget`
Ist gemischt:
- funktional nahe am plattformneutralen EFRO-Frontend
- aber noch mit Shopify-Defaults und Shopify-Admin-Sonderlogik

### `efro`
Ist aktuell die Shopify-first Gesamtpositionierung / Produkt- und Landing-Schicht

---

## Phase-A-Ziel

Die fachlich richtige Trennung lautet:

### EFRO Core
- Brain API
- Widget Runtime
- TTS / Voice
- Recommendation / Retrieval / Ranking
- generische Tenant-/Catalog-Logik

### Shopify Adapter
- OAuth
- Webhooks
- Shopify Produkt-Sync
- Shopify Admin-/Embedding-Kontext
- Shopify-spezifische GDPR-/Partner-Anforderungen
- Shopify-spezifische Commerce-Flows

---

## Was Phase A jetzt konkret bedeutet

1. `efro-shopify` bewusst als Adapter-Repo behandeln
2. `efro-brain` nicht mehr implizit als Shopify-only Brain betrachten
3. `efro-widget` als EFRO-Frontend sehen, Shopify-Sonderfälle nur als Modus
4. `efro`-Meta später schärfen auf: Shopify-first, aber nicht Shopify-only

---

## Nächste sinnvolle Schritte nach Phase A Start

1. Repo-/Systemgrenzen textlich festziehen
2. Tenant-/Shop-Modell später neutralisieren
3. Produkt-/Katalogmodell später vom Shopify-Datenmodell lösen

---

## Kurzfazit

Phase A ist gestartet.

Direkt verifiziert ist:
- `efro-shopify` = Shopify Adapter
- `efro-brain` = Core-nahe Schicht mit Shopify-Resten
- `efro-widget` = Core-nahes Frontend mit Shopify-Resten
- `efro` = Shopify-first Produktpositionierung

Damit ist die nächste Architektur-Richtung klar:
**EFRO Core sauber sichtbar machen, ohne Shopify als starken Adapter aufzugeben.**