# EFRO Phase B — channelContext zuerst

Stand: 2026-04-10

## Aktueller Stand, kurz
Phase A bleibt der Wahrheitsanker: fachlich konsolidiert, meta-seitig gut umgesetzt und technisch sichtbar begonnen. Die Weiterarbeit läuft bewusst worktree-basiert auf den dokumentierten Phase-A-Linien weiter. `efro-shopify` bleibt separat und unverändert am bekannten `403`-Rechteblocker.

## Fachliche Entscheidung
Als erster neutraler Kernbegriff für den bisherigen `shopDomain`-/`shop_domain`-Kontext gilt jetzt:

- `channelContext` zuerst
- `catalogContext` später als spezialisierter Unterbegriff für Produkt-/Katalogebene

## Begründung
Der bisherige Shop-Kontext ist breiter als nur Katalog und trägt bereits implizit:
- Store-/Shop-Identität
- Plattform-/Adapterbezug
- Runtime-Kontext
- Sprach-/Tenant-Bezug
- später voraussichtlich auch Embed-/Admin-/Storefront-Modus

Darum wäre `catalogContext` als erster Oberbegriff zu eng.

## Operative Ableitung
Für den laufenden Phase-B-Prep-Stand bedeutet das:
- `shopDomain` und `shop_domain` noch nicht entfernen
- zuerst nur eine neutrale Kompatibilitätsschicht einziehen
- `channelContext` als Zielbegriff vorziehen
- `catalogContext` erst im nächsten Schritt ergänzen, wenn Produkt-/Katalogmodell separat gezogen wird

## Bereits umgesetzter Fortschritt
Im `efro-brain`-Phase-B-Prep-Worktree wurde die Vorbereitungsdoku entsprechend geschärft und als kleiner Commit gesichert.

Relevante Linie:
- Repo: `efro-brain`
- Worktree: `wt-efro-brain-phase-b-prep-neutral-catalog-20260410b`
- Branch: `parallel/efro-brain-phase-b-prep-neutral-catalog-20260410b`
- Commit: `84d7339dd58f41e1a27d16a70a6f66ddcd391c3a`
- Message: `docs(brain): align neutral prep on channelContext first`

## Nächster sinnvoller Schritt
Der nächste kleine, reversible Schritt ist jetzt:

> an einem zentralen API-/Retrieval-Einstieg `channelContext` als neutralen Zielbegriff code-seitig einzuziehen, dabei `shopDomain` / `shop_domain` vorerst als kompatible Alias-Werte weiterzureichen und Shopify weiterhin als starken Adapter zu behalten.
