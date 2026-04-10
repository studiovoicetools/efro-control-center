# Definition of Done

## Zweck
Objektive Go-Live-Kriterien für EFRO.

## Gate 1: Widget / UI sichtbar und stabil
Kriterien:
- efro-widget rendert Chatfenster und Avatar sichtbar im Browser
- Signed-URL kann erfolgreich geholt werden
- conversation.startSession läuft erfolgreich
- keine Provider-/Hook-Kontextfehler
- sichtbarer Laufzeitbeweis ist dokumentiert

## Gate 2: Mascot / Voice / Lipsync stabil
Kriterien:
- Signed-URL-Route arbeitet stabil
- Voice-Start ist reproduzierbar
- is_speaking reagiert im echten Lauf nachvollziehbar
- Fehlerfall ist kontrolliert
- keine Secrets landen im Client

## Gate 3: SellerBrain korrekt
Kriterien:
- POST /api/brain/chat ist mit dokumentiertem Request-/Response-Vertrag belegt
- Produktquelle ist eindeutig festgelegt
- Snapshot-Fallback ist entweder bewusst erlaubt und dokumentiert oder entfernt
- intent/category/budget/recommendation sind nachvollziehbar
- Policies und Logging sind konsistent

## Gate 4: Shopify-Flow stabil
Kriterien:
- OAuth-/Installationspfad funktioniert
- Produktsync funktioniert
- Webhook-Registrierung funktioniert
- Uninstall-/Privacy-Webhooks funktionieren
- Brain-Proxy und shop-nahe Integrationspfade sind dokumentiert

## Gate 5: Rollenabgrenzung und Production Safety
Kriterien:
- Rolle von efro vs efro-widget ist entschieden und dokumentiert
- ENV-Vertrag ist vollständig
- Secret-Hygiene ist bereinigt
- Repos sind ausreichend clean für verlässliche Arbeit
- zentrale SSOT-Dokumente sind aktuell

## Allgemeine Abnahmeregel
Nichts gilt als "fertig", solange der zugehörige Beleg nicht dokumentiert ist.

## park-update 2026-03-26

### zusätzlicher go-live-grundsatz
- eine zwischenlösung mit hardcoded speziallogik für einzelne produktarten gilt nicht als fertig
- produktsuche muss architektonisch so aufgebaut sein, dass sie für sehr viele shops und sehr große kataloge tragfähig bleibt
- dirty catalogs müssen robust behandelt werden, ohne dass der customer-facing flow unbrauchbar wird

## park-update 2026-03-26

### zusätzlicher go-live-grundsatz
- eine zwischenlösung mit hardcoded speziallogik für einzelne produktarten gilt nicht als fertig
- produktsuche muss architektonisch so aufgebaut sein, dass sie für sehr viele shops und sehr große kataloge tragfähig bleibt
- dirty catalogs müssen robust behandelt werden, ohne dass der customer-facing flow unbrauchbar wird
