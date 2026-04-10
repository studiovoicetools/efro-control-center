# EFRO Phase-B-Vorbereitung — Widget-Seite

Stand: 2026-04-10

## Aktueller Stand, kurz
Phase A ist fachlich konsolidiert, meta-seitig gut umgesetzt und technisch sichtbar begonnen. Die Weiterarbeit in `efro-widget` läuft jetzt bewusst in einem neuen Worktree, der korrekt auf dem dokumentierten Phase-A-Branch `parallel/efro-widget-phase-a-core-boundary-20260408` aufsetzt.

## Ziel dieser Vorbereitungsstufe
Noch kein großer Frontend-Umbau.

Stattdessen klein, worktree-basiert und reversibel vorbereiten:
- Shop-/Tenant-Kontext im Widget als allgemeiner Laufzeit-/Kanal-Kontext lesbarer machen
- Produkt-/Katalogidentität nicht nur still aus Shopify-Feldern lesen
- Shopify weiter als starken Adapter behalten
- Raum für einen neutralen zusätzlichen Kanal schaffen

## Bereits sichtbare Kopplungen in `efro-widget`
Die stärksten aktuell sichtbaren Kopplungen liegen in `src/app/page.tsx` an:
- `shopDomain` als durchgehender Laufzeitkontext
- Produkt-URL-Bildung über Shop-Domain + Handle
- Dedupe-/Identitätsbildung über:
  - `shopify_handle`
  - `shopify_product_id`
  - `shopify_variant_id`

## Kleine nächste Schritte in sinnvoller Reihenfolge

### Schritt 1 — neutrale Benennungsschicht im Widget vorbereiten
Noch keine Funktionalität entfernen, sondern zusätzlich sichtbarer machen:
- was allgemeiner Runtime-/Channel-Kontext ist
- was Shopify-spezifische Adapteridentität ist

Geeignete Richtung:
- benannte Helper für Kanal-/Kontextwerte
- benannte Helper für Commerce-Produkt-/Variantenidentität

### Schritt 2 — URL- und Dedupe-Pfad semantisch trennen
Im Widget zuerst sichtbarer machen:
- generische Produktdarstellung
- Shopify-Adapterwerte als spezieller Fallback / Adapterpfad

### Schritt 3 — neutralen Kanal vorbereiten
Noch keine zweite Commerce-Implementierung.

Aber Namen und Struktur so vorbereiten, dass neben Shopify später auch ein neutraler Kanal sauber andockbar ist.

## Nicht Ziel dieser Stufe
- kein Entfernen funktionierender Shopify-Flows
- kein hektischer Umbau der gesamten `page.tsx`
- keine riskante Vermischung mit späteren Hauptlinien des Basis-Repos

## Arbeitsregel für die nächsten Commits
- klein
- worktree-basiert
- verhaltensneutral oder eng begrenzt
- klarer Typecheck nach jedem Schritt
- semantische Trennung zwischen Core-nahem Widget-Verhalten und Shopify-Adapterwerten

## Nächster konkreter Arbeitskandidat
Am sinnvollsten ist als erster kleiner Commit in diesem Worktree:

> in `src/app/page.tsx` die bestehende `shopDomain`-/Produktidentitätslogik zusätzlich unter neutraleren Helper-Namen lesbar machen, ohne die aktuelle Shopify-Funktionalität zu entfernen.
