# AGENTS.md

Kelvin saksbehandling (AAP) – Next.js (App Router) frontend for saksbehandlere i Nav. Språk i UI og kommentarer er norsk bokmål.

## Kommandoer

```bash
yarn dev                 # next dev --turbo
yarn typecheck           # tsc --noEmit
yarn lint                # eslint app components context hooks lib
yarn test                # vitest --run (prosjektene "node" og "dom")
yarn vitest --run <sti>  # enkeltfil
yarn run-prettier        # prettier --write .
yarn gentypes:*          # regenerer API-typer, se skill oppdater-api-typer
yarn gen-umami-docs      # oppdater umami-event-types.md
```

Pakkebehandler er Yarn 4 (corepack). TypeScript kan ikke oppgraderes til 7.x ennå (Yarn-patch og `@typescript-eslint`).

## Struktur

- `app/` – ruter. `app/saksbehandling/sak/[saksnummer]/[behandlingsreferanse]/[aktivGruppe]` viser en steggruppe; `app/saksbehandling/api/**` er route handlers som klienten kaller; `app/postmottak` og `app/oppgave` er egne apper.
- `components/behandlinger/<gruppe>/` – steg/vilkårskort. `components/oppgavekolonne/OppgaveKolonne.tsx` velger gruppe fra `aktivGruppe`.
- `components/vilkaarskort/` – kortvarianter (`VilkårskortMedFormOgMellomlagring`, `VilkårskortPeriodisert`, `VilkårskortMedForm`).
- `components/form/` – `useConfigForm` + `FormField` og `*Wrapper`-komponenter.
- `hooks/saksbehandling/` – klient-hooks (`useLøsAvklaringsbehov`, `useMellomlagring`, `useVilkårskortVisning`, `useFlyt`).
- `lib/services/` – server-side API-klienter (`apiFetch`), `lib/clientApi.ts` for klientkall, `lib/types/` for typer (genererte `*Schema.d.ts` + egne alias), `lib/utils/` for rene hjelpefunksjoner.
- `context/` – React-kontekster (bl.a. `FeatureFlagProvider`).

## Konvensjoner

- **Server vs. klient:** `*MedDataFetching.tsx` er async server-komponenter som henter grunnlag/mellomlagring via `lib/services`; selve vilkårskortet er `'use client'`.
- **Skjema:** nye skjemaer/modaler bruker `useConfigForm` + `<FormField>`, ikke manuell react-hook-form med enkeltstående `*Wrapper`.
- **Generert kode:** `lib/types/schema.d.ts`, `postmottakSchema.d.ts`, `oppgaveSchema.d.ts` og `gosysSchema.d.ts` genereres – rediger aldri for hånd.
- **Feature toggles:** nye Unleash-flagg legges i både `FLAGS` og `mockedFlags` i `lib/services/unleash/unleashToggles.ts`. Klient: `useFeatureFlag`; server: `unleashService.isEnabled`.
- **Umami:** navngi `<KONTEKST>_<HANDLING>[_<DETALJ>]` i SCREAMING_SNAKE_CASE. Stegvarighet logges som `STEG_<STEG>_VARIGHET` via `loggUmamiVarighet` etter vellykket lagring; steg må finnes i `UMAMI_STEG` (`lib/utils/umami/steg.ts`). Importer direkte fra undermoduler i `lib/utils/umami/`.
- **Kommentarer:** bruk JSDoc (`/** ... */`) på funksjoner/metoder, ikke `//`. Kommenter kun det som trenger forklaring.
- **Design:** `@navikt/ds-react` v8 med spacing-tokens (`space-16` = 16 px). Se skillen `aksel-spacing`.
- **Commits:** `AAP-<nr> <beskrivelse>`, `AAP-BAU <beskrivelse>` for vedlikehold, `[MIGRERING] …` for Arena-migrering.

## Testing

- Vitest. `*.test.ts` i `lib/` og `components/` kjører i node, `*.test.tsx` og `hooks/**` i happy-dom med `vitestSetup.ts`.
- Bruk `render` fra `lib/test/CustomRender` (wrapper kontekster og `FeatureFlagProvider` med `mockedFlags`), `setMockFlytResponse` fra `vitestSetup` og `vitest-fetch-mock`.
- Ikke kjør testsuiten for rene typeendringer – kjør `yarn typecheck`.

## Skills (`.github/skills/`)

- `nytt-vilkaarskort-steg` – nytt steg/vilkårskort fra Behovstype til test
- `ny-feature-toggle` – legg til/fjern Unleash-toggle
- `ny-form-med-useconfigform` – skjema/modal med `useConfigForm`
- `oppdater-api-typer` – regenerer OpenAPI-typer og rett typereferanser
