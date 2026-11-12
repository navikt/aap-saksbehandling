---
name: ny-feature-toggle
description: Legg til eller fjern en Unleash feature toggle i aap-saksbehandling – FLAGS, mockedFlags, useFeatureFlag (klient), unleashService (server) og testoppsett. Bruk ved nye toggles og ved opprydding av gamle toggles/død kode.
---

# Feature toggles (Unleash)

Alle toggles defineres i `lib/services/unleash/unleashToggles.ts`. Flaggene hentes på serveren i `app/layout.tsx`
(`getAllFlags`) og gis til klienten via `FeatureFlagProvider` (`context/UnleashContext.tsx`).

## Legge til en toggle

1. Opprett toggle i Unleash (utenfor dette repoet) med samme navn.
2. I `lib/services/unleash/unleashToggles.ts`: legg navnet til **både** `FLAGS` **og** `mockedFlags`.
   - `mockedFlags` brukes lokalt (uten `UNLEASH_SERVER_API_URL`) og i alle tester. Bruk vanligvis `true` slik at ny funksjonalitet testes.
3. Bruk flagget:
   - **Klientkomponent:** `const aktiv = useFeatureFlag('NavnPåFlagg');` (`context/UnleashContext`)
   - **Servekomponent:** `unleashService.isEnabled('NavnPåFlagg')` (`lib/services/unleash/unleashService`)
4. Test begge grener. Komponenter som bruker `useFeatureFlag` krever `FeatureFlagProvider`. `customRender` fra `lib/test/CustomRender` wrapper allerede med `mockedFlags`. For å teste av-grenen, wrap selv:
   ```tsx
   <FeatureFlagProvider flags={{ ...mockedFlags, NavnPåFlagg: false }}>...</FeatureFlagProvider>
   ```
   (se `components/postmottak/digitaliserdokument/annetrelevantdokument/DigitaliserAnnetRelevantDokument.test.tsx`).

## Fjerne en toggle (vanlig opprydding)

Commit-konvensjon i repoet: `AAP-BAU Fjern feature toggle <Navn>`.

1. Finn alle bruk: søk etter flaggnavnet (inkl. tester).
2. Behold gren som gjelder når flagget er **på** (spør bruker hvis usikker), og slett den andre grenen og kode som blir ubrukt (komponenter, hjelpefunksjoner, typer, CSS, tester).
3. Fjern `useFeatureFlag`/`unleashService.isEnabled`-kall og tilhørende imports.
4. Fjern navnet fra `FLAGS` og `mockedFlags`.
5. Fjern overrides i tester (`{ ...mockedFlags, Navn: false }`) og tester som bare dekket den gamle grenen.
6. Kjør:
   ```bash
   yarn typecheck && yarn lint && yarn test
   ```
   `knip` (se `knip.json`) kan avsløre ubrukt kode etter opprydding.

## Vanlige feil

- Navnet er lagt til i `FLAGS` men ikke `mockedFlags` (eller omvendt) → typefeil, siden `Flags` er `Record<FlagNames, boolean>`.
- `useFeatureFlag` i server-komponent (kaster/virker ikke) – bruk `unleashService` der.
- Gammel kode blir liggende etter at toggle er fjernet.
