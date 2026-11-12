---
name: oppdater-api-typer
description: Regenerer OpenAPI-typer (behandlingsflyt, postmottak, oppgave, gosys) i aap-saksbehandling og rett opp typereferanser i lib/types. Bruk når backend-API har endret seg, ved typefeil etter oppdatering, eller når du trenger nye DTO-er.
---

# Oppdatere API-typer

Typene i `lib/types/*Schema.d.ts` er **generert** – rediger dem aldri for hånd.

| Fil                               | Backend                         | Script                                                                                                                                              |
| --------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/types/schema.d.ts`           | aap-behandlingsflyt (port 8080) | `yarn gentypes:behandlingsflyt` (lokal backend), `yarn gentypes:fil` (`../aap-behandlingsflyt/openapi.json`), `yarn gentypes:ci` (`./openapi.json`) |
| `lib/types/postmottakSchema.d.ts` | postmottak (port 8070)          | `yarn gentypes:postmottak`                                                                                                                          |
| `lib/types/oppgaveSchema.d.ts`    | oppgave (port 8084)             | `yarn gentypes:oppgave`                                                                                                                             |
| `lib/types/gosysSchema.d.ts`      | Gosys oppgave API (dev)         | `yarn gentypes:gosys`                                                                                                                               |

`yarn gentypes:all` kjører alle fire. Scriptene kjører `openapi-typescript`, deretter `scripts/decode-unicode-escapes.mjs` og `prettier`.

I CI oppdateres `schema.d.ts` automatisk av `.github/workflows/oppdater-openapi-typer.yml` når `openapi.json` endres i aap-behandlingsflyt (oppretter PR).

## Fremgangsmåte

1. Velg riktig script (se tabell). Lokale scripts krever at backend kjører. Hvis ikke, spør bruker om `openapi.json`-fil eller bruk `yarn gentypes:fil` hvis `../aap-behandlingsflyt` finnes.
2. Kjør scriptet og se på `git diff --stat` – diffen skal bare inneholde reelle API-endringer.
3. Rett typereferanser: appens egne typealias ligger i `lib/types/types.ts` (behandlingsflyt), `postmottakTypes.ts`, `oppgaveTypes.ts`, `gosysTypes.ts` og refererer `components['schemas']['no.nav.aap...']`. Oppdater når DTO-er er omdøpt/flyttet.
4. Kjør `yarn typecheck` og fiks feil i bruksstedene (komponenter, services, tester og mock-data).
5. Commit-melding: `AAP-BAU: Oppdater API-typer og rett typereferanser` (eller med saksnummer).

## Testing

- **Rene typeendringer:** ikke kjør testsuiten, kun `yarn typecheck` (og `yarn lint` ved behov).
- Hvis du også endret runtime-logikk (mapping, nye felter i skjema), kjør berørte tester: `yarn vitest --run <sti>`.

## Fallgruver

- Unicode-escapes i generert fil: scriptene håndterer dette – ikke kjør `openapi-typescript` direkte.
- Omdøpte enum-verdier/`StegType`/`StegGruppe` kan kreve endringer i `lib/utils/umami/steg.ts`, `oversettelser.ts`, `vurderingsbehov*.ts` og `Behovstype` i `lib/utils/form.ts`.
- Nye påkrevde felter i løsnings-DTO-er gir typefeil i alle `løsAvklaringsbehov`-kall – oppdater skjemaene, ikke bruk `as`-casting.
