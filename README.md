# AAP Saksbehandling

Frontendapplikasjon for ny saksbehandlingsløsning på AAP

## Bygge og kjøre app lokalt

### Github package registry

Vi bruker Github sitt package registry for npm-pakker, siden flere av Nav sine pakker kun blir publisert her.

For å kunne kjøre `yarn install` lokalt må du logge inn mot Github package registry. Legg til følgende i .bashrc eller .zshrc lokalt på din maskin:
I .bashrc eller .zshrc:

`export NPM_AUTH_TOKEN=github_pat`

Hvor github_pat er din personal access token laget på github (settings -> developer settings). Husk `read:packages`-rettighet og enable SSO når du oppdaterer/lager PAT.

### Kjøre lokalt

#### Alternativ 1: Mot dev-gcp

1. Hent secret med [aap-cli/get-secret.sh](https://github.com/navikt/aap-cli): \
   `get-secret`
2. Kopier innhold fra: \
   `.env.dev-gcp` _og_ `.env-template-dev` inn i `.env.local` 
3. Start wonderwall med \
  `docker-compose up -d`
4. Kjør opp frontend med: \
   `yarn dev`
5. Åpne appen via Wonderwall: \
   http://localhost:4000

**OBS**: Må også legge til følgende i `/etc/hosts`: \
`127.0.0.1   host.docker.internal`

#### Alternativ 2: Mot mock backend

Start `behandlingsflyt`, `postmottak`, e.l. sin backend lokalt ved å kjøre `TestApp`-klassen fra IntelliJ eller 
følge guiden her https://aap-sysdoc.ansatt.nav.no/funksjonalitet/Behandlingsflyt/teknisk/#kj%C3%B8re-lokalt

OBS: Du må kopiere `.env-template` til `.env.local` for å kunne kjøre lokalt.

```
yarn install
yarn dev
```

For å opprette en lokal test-sak, åpne `http://localhost:3000/saksoversikt/` i nettleseren.

---

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.

# Henvendelser

---

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

# For NAV-ansatte

---

Interne henvendelser kan sendes via Slack i kanalen #po-aap-team-aap.

# Åpen kildekode

Løsningen er ikke produksjonssatt og vi har derfor vurdert at vi på nåværende tidspunkt ikke gjør kildekoden åpen av følgende grunn:

- kode som implementerer lovendringer og forskrifter som ikke er ferdig behandlet.
