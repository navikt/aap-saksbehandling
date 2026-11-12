---
name: nytt-vilkaarskort-steg
description: Lag et nytt vilkårskort/behandlingssteg i Kelvin saksbehandling – Behovstype, grunnlag-henting, server/client-komponenter, registrering i gruppe, Umami og test. Bruk når noen skal legge til et nytt steg, avklaringsbehov eller vilkår i saksbehandlingsflyten.
---

# Nytt vilkårskort for et steg

Steg i behandlingsflyten tilsvarer et avklaringsbehov i `aap-behandlingsflyt`. Frontend viser dem som vilkårskort
inne i en **steggruppe** (`aktivGruppe` i URL-en). Referanseimplementasjoner:

- Periodisert, egen gruppe: `components/behandlinger/oppholdskrav/`
- Ikke-periodisert, flere steg i én gruppe: `components/behandlinger/institusjonsopphold/soning/` og `components/behandlinger/sykdom/`

## Før du starter

1. Avklar med bruker: stegtype (`StegType`), steggruppe (`StegGruppe`), avklaringsbehovkode, paragraf/overskrift, om vurderingen er **periodisert** og om vilkåret tilhører NAV-kontor eller NAY.
2. Typene kommer fra backend. Sjekk at `StegType`, `StegGruppe`, grunnlag-responsen og løsnings-DTO finnes i `lib/types/schema.d.ts`. Hvis ikke: bruk skillen `oppdater-api-typer` først.
3. Skal steget skjules bak en toggle? Bruk skillen `ny-feature-toggle`.

## Sjekkliste

### 1. Typer og kode

- `lib/utils/form.ts`: legg til kode i `Behovstype`-enumen (f.eks. `OPPHOLDSKRAV_KODE = '5035'`).
- `lib/types/types.ts`: eksporter typealias for grunnlag-responsen (`components['schemas'][...]`), og for periodisert løsning legg til varianten i `lib/types/løsningerforperioder.ts`.
- `lib/services/saksbehandlingservice/saksbehandlingService.ts`: legg til `hentXGrunnlag(behandlingsreferanse)` med `apiFetch<T>(url, saksbehandlingApiScope, 'GET')` mot `/api/behandling/${behandlingsreferanse}/grunnlag/<sti>`.

### 2. Komponenter (mappe `components/behandlinger/<gruppe>/<steg>/`)

- `XMedDataFetching.tsx` (**server-komponent**, ingen `'use client'`): henter grunnlag, returnerer `<ApiException apiResponses={[grunnlag]} />` ved `isError`, henter `hentMellomlagring(behandlingsreferanse, Behovstype.X_KODE, readOnly, erIkkePåVent)` og rendrer klientkomponenten. `readOnly` = `stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle`.
- `X.tsx` (**klient-komponent**, `'use client'`) med disse hookene:
  - `useLøsAvklaringsbehov('<STEG_TYPE>')` → `løsAvklaringsbehov` (ikke periodisert) eller `løsPeriodisertAvklaringsbehov`
  - `useVilkårskortVisning(readOnly, '<STEG_TYPE>', initialMellomlagring)` → `visningModus`, `formReadOnly`, `visningActions`
  - `useUmamiStartTidspunkt(visningModus)`
  - `useMellomlagring(Behovstype.X_KODE, initialMellomlagring, form)`
  - Skjema: bruk `useConfigForm` + `<FormField>` (se skillen `ny-form-med-useconfigform`), ikke manuell react-hook-form + `*Wrapper`.
- Velg kortvariant:
  - `VilkårskortMedFormOgMellomlagring` – én vurdering med utkast/mellomlagring (standard)
  - `VilkårskortPeriodisert` – periodiserte vurderinger med `NyVurderingExpandableCard` / `TidligereVurderingExpandableCard` og `validerPeriodiserteVurderingerRekkefølge` (se Oppholdskrav)
  - `VilkårskortMedForm` – kun for steg uten mellomlagring
- Ved submit: kall løs-funksjonen med `behandlingVersjon` + `referanse: behandlingsreferanse`, og i callback `loggUmamiVarighet('STEG_<X>_VARIGHET', umamiStartTidspunkt, Date.now())`, `nullstillMellomlagretVurdering()`, `visningActions.onBekreftClick()`.
- `X-utils.ts`: ren funksjon for `getDefaultValuesFromGrunnlag` og `mapFormTilDto` (enkel å enhetsteste).
- Tidligere vurderinger vises i egen `XTidligereVurdering.tsx` når det er relevant.

### 3. Gruppe og registrering

- Nytt steg i eksisterende gruppe: legg til `getStegData(gruppe, '<STEG_TYPE>', flyt)` i gruppekomponenten (f.eks. `Sykdom.tsx`) og wrap `XMedDataFetching` i `<StegSuspense>` inne i `<GruppeSteg>`. Bruk `skalViseStegForPeriodisertGrunnlag` / `stegData.skalViseSteg` for å avgjøre om kortet skal vises.
- Ny gruppe: lag `XGruppe.tsx` (se `OppholdskravGruppe.tsx`) og legg til `{aktivGruppe === '<GRUPPE>' && ...}` i `components/oppgavekolonne/OppgaveKolonne.tsx`.
- `lib/utils/vilkårskort.ts`: legg til case i `behovstypeTilVilkårskortLink` (gruppe + `#<STEG>`-anker) – brukes av lenker til vilkårskortet.
- `lib/utils/oversettelser.ts`: gruppenavn (steggruppe) hvis ny gruppe.
- `lib/utils/vurderingsbehov.ts` og `vurderingsbehovOptions.ts`: kun hvis steget utløses av et nytt vurderingsbehov.
- `lib/utils/umami/steg.ts`: legg til steget i `UMAMI_STEG` (gir typen `STEG_<X>_VARIGHET`). Kjør `yarn gen-umami-docs` hvis dokumentasjonen påvirkes.
- Lokal testsak: `components/opprettsak/OpprettSakLocal.tsx` har en steg-liste hvis steget skal kunne opprettes lokalt.

### 4. Test

Legg ved `X.test.tsx` i samme mappe (mal: `Oppholdskrav.test.tsx`, `Soningsvurdering.test.tsx`):

- `render` fra `lib/test/CustomRender` (gir kontekster og `FeatureFlagProvider`)
- `setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: '<STEG_TYPE>' })` i `beforeEach` (fra `vitestSetup`)
- `createFetchMock(vi)` for fetch, `userEvent.setup()` for interaksjon
- Test minst: visning, validering av påkrevde felt, vellykket innsending, og read-only.

## Validering

```bash
yarn typecheck && yarn lint && yarn vitest --run <sti-til-test>
```

## Vanlige feil

- Glemmer å legge steget i `UMAMI_STEG` → typefeil på `STEG_<X>_VARIGHET`.
- Mellomlagring bruker feil `Behovstype` (må matche avklaringsbehovet som løses).
- `'use client'` på `MedDataFetching`-komponenten, som skal være server-komponent og `async`.
- Mangler `behandlingVersjon` i løsningen → konflikt (409) mot backend.
