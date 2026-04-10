# EFRO Phase A — Active Shopify Remains

Stand: 2026-04-08

## Zweck
Diese Notiz ergänzt Phase A mit **direkt verifizierten aktiven Shopify-Resten** in den Repos `efro-brain` und `efro-widget`.

Sie trennt bewusst zwischen:
- aktiven Core-nahen Shopify-Resten
- klaren Adapter-Funktionen
- den nächsten sinnvollen Entkopplungsschritten

---

## 1. Direkt verifizierte aktive Shopify-Reste in `efro-brain`

### 1.1 Aktive Defaults / Fallbacks
Direkt verifiziert:
- `pages/api/brain/chat.ts`
  - Fallback auf `avatarsalespro-dev.myshopify.com`
- `pages/api/brain/chat-v2-shadow.ts`
  - Fallback auf `avatarsalespro-dev.myshopify.com`
- `pages/api/tool/search-products.ts`
  - Fallback auf `avatarsalespro-dev.myshopify.com`

Bedeutung:
- der Brain-Core nimmt aktuell implizit Shopify-Domains als Standard-Identität an
- das ist ein Core-naher Rest, kein reiner Adapterpunkt

### 1.2 Aktiver Shopify-Sync-Pfad
Direkt verifiziert:
- `pages/api/shopify/sync.ts`
  - schreibt `shopify_handle`, `shopify_product_id`, `shopify_variant_id`
  - Route ist `/api/shopify/sync`

Bedeutung:
- das ist klar Shopify-Adapter-Funktionalität
- dieser Pfad gehört nicht in einen neutralen Plattformkern, sondern in die Adapter-Schicht

### 1.3 Aktive Retrieval-Kopplung an Shopify-Felder
Direkt verifiziert in `src/retrieval/runRetrieval.ts`:
- Retrieval arbeitet mit
  - `shopify_handle`
  - `shopify_product_id`
  - `shopify_variant_id`
- und filtert auf nicht-null bei
  - `shopify_product_id`
  - `shopify_variant_id`

Bedeutung:
- der aktive Retrieval-Kern ist noch nicht plattformneutral
- das ist derzeit der stärkste Core-seitige Shopify-Rest im Brain

### 1.4 Aktive Normalisierung mit Shopify-Fallback
Direkt verifiziert in `src/brainv2/catalog/normalizeCatalogProduct.ts`:
- `handle` wird aus `handle || shopify_handle` gebildet

Bedeutung:
- Shopify-Metadaten greifen noch direkt in die generischere Katalogschicht hinein

### 1.5 Aktive Shopify-GDPR-Pfade
Direkt verifiziert:
- `pages/api/gdpr/shop-redact.ts`
- `pages/api/gdpr/customers-data-request.ts`
- `pages/api/gdpr/customers-redact.ts`
- Nutzung von `x-shopify-hmac-sha256`

Bedeutung:
- das ist klar Adapter-/Plattformpflicht für Shopify
- diese Funktionalität ist nicht Core, sondern Shopify-gebundene Compliance-Schicht

---

## 2. Direkt verifizierte aktive Shopify-Reste in `efro-widget`

Alle unten genannten Treffer liegen direkt im aktiven Pfad:
- `src/app/page.tsx`

### 2.1 Shopify-CDN- und Produktbild-Logik
Direkt verifiziert:
- Prüfung auf `cdn.shopify.com`
- Sonderbehandlung für `cdn.shopify.com/s/files/1/0000/0001`

Bedeutung:
- die Produktbild-/URL-Logik ist noch sichtbar Shopify-geprägt
- das ist Widget-/Adapter-nahe Darstellungskopplung

### 2.2 Shopify-Produktidentität in der UI-Logik
Direkt verifiziert:
- Nutzung von
  - `product.shopify_handle`
  - `p.shopify_product_id`
  - `p.shopify_variant_id`

Bedeutung:
- das Widget ist bei Produktauflösung und Deduplizierung noch direkt an Shopify-Felder gekoppelt
- das ist ein UI-seitiger Rest der derzeitigen Datenmodell-Kopplung

### 2.3 Shopify-Domain als UI-Default
Direkt verifiziert:
- `shopDomain` Default: `avatarsalespro-dev.myshopify.com`
- Query-Param-Fallback ebenfalls auf `avatarsalespro-dev.myshopify.com`

Bedeutung:
- auch das Widget nimmt aktuell implizit Shopify als Standard-Tenant an
- das ist ein wichtiger Rest für Phase B

### 2.4 Shopify-Admin-Embedding-Erkennung
Direkt verifiziert:
- Prüfung auf `admin.shopify.com`

Bedeutung:
- das ist klar ein Shopify-Adapter-/Embedding-Modus
- diese Logik kann bleiben, sollte aber explizit als Modus behandelt werden, nicht als stiller Standard des gesamten Frontends

---

## 3. Einordnung für Phase A

### Was klar Adapter ist
- `efro-shopify` generell
- `pages/api/shopify/sync.ts`
- Shopify-GDPR-Routen mit `x-shopify-hmac-sha256`
- Shopify-Admin-Embedding im Widget

### Was noch Core-nah, aber Shopify-gebunden ist
- Brain-Fallbacks auf `*.myshopify.com`
- Retrieval-Abhängigkeit von `shopify_product_id`, `shopify_variant_id`, `shopify_handle`
- Widget-Domain-Defaults auf `avatarsalespro-dev.myshopify.com`
- Widget-Produktauflösung über Shopify-Felder

---

## 4. Nächste sinnvolle Schritte

### Nach Phase-A-Start
1. Shopify-Core-Reste im Brain **sichtbar markieren**, nicht sofort blind umbauen
2. Tenant-/Shop-Modell neutralisieren
3. Retrieval von harter Shopify-ID-Pflicht lösen
4. Widget-Defaults von `myshopify.com` entkoppeln
5. Shopify-Admin-/GDPR-/Sync-Pfade ausdrücklich als Adapterpunkte behandeln

---

## 5. Kurzfazit

Direkt verifiziert ist:
- `efro-brain` hat aktive Shopify-Kopplung vor allem im **Katalog-/Retrieval-Datenmodell** und in **Defaults**
- `efro-widget` hat aktive Shopify-Kopplung vor allem im **UI-/Embed-Modus** und in der **Produktauflösung**
- genau diese Punkte sind die nächsten sinnvollen Ziele nach dem Phase-A-Start

Damit ist die Phase-A-Trennung klarer:
- Shopify als Adapter behalten
- Core-nahe Shopify-Reste sauber sichtbar machen
- erst danach gezielt neutralisieren.