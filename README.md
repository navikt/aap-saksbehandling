# Frontend for saksbehandling av AAP (Kelvin)

Dette er frontend-applikasjonen for saksbehandling av arbeidsavklaringspenger (AAP) i Nav.

## Førstegangsoppsett

Dette oppsettet forutsetter at du har følgende programvare installert:

- Node.js
- Corepack (Kommer med Node.js og håndterer riktig versjon av yarn for deg, må aktiveres med `corepack enable`)
- Docker med colima og docker-compose

### Sett opp GitHub token

1. Gå inn på GitHub under brukeren din på Settings -> Developer settings
2. Velg Personal access tokens -> Tokens (classic) -> Generate new token (classic)
3. Gi token et navn, sett utløpsdato og huk av for `read:packages`-rettighet
4. Klikk Generate token og kopier tokenet (Det forsvinner fra siden)
5. Klikk Configure SSO -> Authorize for navikt-organisasjonen
6. Legg inn miljøvariabel med token i ~/.bashrc eller ~/.zshrc:
   ```
   export NPM_AUTH_TOKEN=<token-her>
   ```
   Husk å kjøre `source ~/.bashrc` eller `source ~/.zshrc` etterpå for å laste inn endringene, evt start terminal på nytt.

### Prettier og linting

Prosjektet bruker prettier og eslint. Skru gjerne på "Automatic configuration" for disse i din IDE.

For at pre-commit hooks for linting og formatering skal kunne kjøre, må du sette opp Husky med følgende kommando (trengs bare én gang):

```bash
  yarn husky
```

## Kjøre opp lokalt mot lokal backend

1. Kopier `.env-template` til `.env.local`:
   ```bash
   cp .env-template .env.local
   ```
2. Installer avhengigheter og start applikasjonen:
   ```bash
   yarn install
   yarn dev
   ```
   Applikasjonen skal nå være tilgjengelig i nettleseren på http://localhost:3000

**OBS:** Husk å starte backend-tjenestene lokalt også, etter egen oppskrift.

## Kjøre opp lokalt mot devmiljø

1. Hent secret (se: https://github.com/navikt/aap-cli)
   ```bash
   get-secret
   ```
2. Kopier miljøvariabler inn i `.env.local`:
   ```bash
   cat .env.dev-gcp .env-template-dev > .env.local
   ```
3. Start Wonderwall:
   ```bash
   colima start
   docker-compose up -d
   ```
4. Installer avhengigheter og start applikasjonen:
   ```bash
    yarn install
    yarn dev
   ```
   Applikasjonen skal nå være tilgjengelig i nettleseren på http://localhost:4000

## Diverse nyttige kommandoer

### Kjøring av tester

For å kjøre tester lokalt, bruk følgende kommando:

```bash
  yarn test
```

### Generering av typer

Prosjektet bruker openapi-typescript for å generere TypeScript-typer basert på typer fra backend.
For å generere typene, kjør følgende kommando:

```bash
  yarn gentypes
```

**OBS:** Dette krever at backend kjører lokalt. Typer for aap-oppgave, aap-postmottak-backend og aap-statistikk ligger i egne pakker
og må hentes ikke separat med yarn install.

### Oppdatere avhengigheter

For å forhindre utilsiktede endringer i `yarn.lock` er man tvunget til å alltid kjøre følgende kommando når man vil oppdatere avhengigheter:

```bash
  yarn install --no-immutable
```

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-aap-åpen
