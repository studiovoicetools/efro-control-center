# parking state — 2026-03-26

## aktueller ehrlicher stand

### 1. voice/chat-wahrheit
- der frühere widerspruch zwischen voice und chat wurde deutlich reduziert
- der elevenlabs-agent-branch nutzt jetzt ein aktives tool
- voice und chat sagen jetzt im grundsatz dieselbe wahrheit

### 2. tool-endpoint
- `pages/api/tool/search-products.ts` ist als aktiver runtime-endpoint vorhanden
- der frühere tote tool-pfad war ein echter root cause und wurde behoben

### 3. aktuelles offenes kernproblem
- die aktuelle brain-lösung ist noch nicht die finale scale-architektur
- der derzeitige produktfilter wurde verbessert, ist aber nicht als endlösung für millionen shops / millionen produkte akzeptiert
- bad products bleiben absichtlich als crashtest im katalog
- efro soll auch mit schmutzigen katalogen brauchbare treffer liefern, aber langfristig über saubere, skalierbare retrieval-/ranking-architektur statt hardcoded kategorie-logik

### 4. katalog-wahrheit
- in der db existieren snowboard-produkte für `avatarsalespro-dev.myshopify.com`
- das problem ist daher nicht mehr "kein bestand", sondern ranking / normalisierung / retrieval-qualität

### 5. bewusste entscheidung für die nächste session
- keine weiteren hardcoded spezial-fixes als endlösung übernehmen
- nächste arbeit: brain architektonisch neu auf scale aufbauen

## nächste session — zielbild

### scale-first brain
- generische query-verarbeitung statt shop-spezifischer oder hartcodierter kategorie-fälle
- retrieval/ranking muss für viele shops und viele produkte tragfähig sein
- bad products nicht einfach löschen, sondern intelligent abstrafen / markieren
- chat und voice müssen denselben kanonischen backend-pfad nutzen

## branch-stand
- efro-brain: `wip/brain-product-truth`
- efro-widget: voice-arbeitsstand separat, main nicht blind weiter patchen

## wichtig
dieser park-stand hält bewusst fest:
- p0 voice-wahrheit deutlich besser
- p1 produktwahrheit noch nicht endgültig gelöst
- aktuelle filter-patches sind zwischenstand, nicht endgültige scale-architektur
