# EFRO Agent ↔ Control Center — Integrationsstatus (2026-04-06)

## Zielbild

Die saubere Zielstruktur bleibt:

- `efro-control-center` = primäres Dashboard / Operator-Oberfläche / Vercel-orientiert
- `efro-agent` = interner Runtime-Service / Investigationsoberfläche / eigener Server

Die Verbindung soll kontrolliert und bewusst sein, nicht als unstrukturierter Browser-POST oder als wilde Query-String-Übergabe.

---

## Gewünschter Handoff-Ansatz

Die erste sinnvolle Version ist:

- Incident-Paket
- `handoff_id`
- Link-Einstieg über `Open in Agent`
- Agent-Ziel: `/handoff/<handoff_id>`

### Minimaler Incident-Paket-Inhalt

- `incident_id`
- `shop_domain`
- `priority`
- `severity`
- `scope`
- `likely_repo`
- `likely_subsystem`
- `summary`
- `top_findings`
- `checks_run`
- `recommended_next_action`

---

## Tatsächlich im Agenten vorbereitet

Im `efro-agent`-Stand wurden folgende Integrationsgrundlagen bereits geschaffen:

- serverseitige Handoff-Pakete
- Erzeugung einer `handoff_id`
- Abruf eines einzelnen Handoffs per API
- Abruf einer Handoff-Liste per API
- UI-Einstieg unter `/handoff/<handoff_id>`
- Nutzung des Handoff-Kontexts im Chat-Flow des Agenten
- sichtbare Handoff-Liste in der Agent-UI

---

## Wichtig: aktueller Status

Konzeptionell: klar
Im Agenten vorbereitet: ja
Im Control-Center-App-Code als fertiger UI-/API-Flow: nicht automatisch mit diesem Stand erledigt

Das heißt:
- Der Agent ist für den Handoff vorbereitet.
- Die vollständige produktive Auslösung aus dem Control Center heraus ist separat sauber einzubauen.

---

## Nächster sinnvoller Integrationsschritt

Im `efro-control-center` sollte als erste saubere Integrationsstufe ein gezielter Operator-Entry-Point ergänzt werden:

- Button `Open in Agent`
- Control Center erzeugt Incident-Paket
- Agent-Link öffnet `/handoff/<handoff_id>`

Erst danach sollten weitergehende API-/POST-Flows vertieft werden.
