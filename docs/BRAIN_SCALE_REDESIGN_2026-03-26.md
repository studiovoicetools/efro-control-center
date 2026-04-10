# brain scale redesign — 2026-03-26

## ziel
efro brain so neu aufbauen, dass die produktsuche und empfehlungslogik fuer sehr viele shops und sehr grosse kataloge tragfaehig ist.

## was ausdruecklich NICHT die endlösung ist
- hartcodierte kategorie-fixes wie tv/snowboard als dauerhafte strategie
- laufzeit-logik, die auf einzelnen crash-test-faellen basiert
- getrennte backend-wahrheiten fuer chat und voice
- ranking, das stark von unsauberen tags oder gluecksfaellen abhaengt

## bestaetigter zwischenstand
- voice und chat sprechen jetzt weitgehend dieselbe wahrheit
- aktiver tool-endpoint fuer voice existiert
- db enthaelt echte snowboard-produkte
- aktuelle filter-fixes sind nur zwischenstand und nicht final skalierbar

## scale-first zielarchitektur

### 1. single source of truth fuer retrieval
ein kanonischer retrieval-pfad fuer:
- chat
- voice
- widget
- tools

dieser pfad liefert immer:
- normalized query
- matched products
- ranking reasons
- reply text basis
- diagnostics

### 2. retrieval nicht hartcodiert, sondern datengetrieben
pro shop muessen folgende suchfelder aufgebaut oder gepflegt werden:
- title
- description
- tags
- product_type / category
- vendor
- price
- availability
- publish status
- catalog hygiene flags

### 3. normalisierung beim sync, nicht erst zur laufzeit
sync/import muss produkte in eine saubere suchform bringen:
- tags immer als array
- statusflags normiert
- title/description/token fields vorbereitet
- category/product_type vereinheitlicht
- optionale such- und ranking-felder berechnet

### 4. customer-facing ranking getrennt von catalog-audit
zwei verschiedene outputs:
- customer-facing retrieval: zeigt bestmoegliche kaufbare treffer
- catalog-audit: erkennt schlechte daten und gibt verbesserungsvorschlaege

bad products bleiben im system, aber verwässern nicht unkontrolliert den kundenflow.

### 5. retrieval pipeline
pipeline soll generisch sein:
1. query normalization
2. intent extraction
3. hard filters (shop, budget, availability, visibility)
4. lexical / structured retrieval
5. optional semantic retrieval
6. ranking
7. response construction

### 6. keine shop-spezifischen spezialregeln als grundarchitektur
produktarten wie tv oder snowboard duerfen spaeter als synonyms oder taxonomy-daten vorkommen, aber nicht als hauptarchitektur in if/else-ketten.

### 7. observability
jede suche sollte spaeter nachvollziehbar machen:
- welcher shop
- welche query
- welche filter
- wie viele kandidaten
- warum ein produkt oben steht
- warum null treffer herauskam

## naechste umsetzungsschritte

### phase a — architecture extraction
- aktuellen brain/chat und tool/search-products pfad vergleichen
- gemeinsamen retrieval-kern identifizieren
- shared retrieval service definieren

### phase b — data contract
- produkt-normalisierungsvertrag definieren
- dirty catalog flags definieren
- output schema fuer retrieval festlegen

### phase c — implementation
- shared retrieval service bauen
- chat und voice auf denselben retrieval service umstellen
- alte hardcoded speziallogik schrittweise entfernen

## offene entscheidungen fuer naechste session
- wo der gemeinsame retrieval service liegen soll
- wie normalisierte produktfelder gespeichert werden
- ob semantic search sofort oder spaeter kommt
- wie catalog-audit und customer-facing ranking sauber getrennt werden

## park-fazit
der aktuelle code ist zwischenstand.
die naechste echte arbeit ist ein scale-first redesign des brain, nicht weiteres patchen einzelner crash-test-kategorien.
