# AAP Saksbehandling

Frontendapplikasjon for ny saksbehandlingsløsning på AAP

## Bygge og kjøre app lokalt

### Github package registry

Vi bruker Github sitt package registry for npm pakker, siden flere av Nav sine pakker kun blir publisert her.

For å kunne kjøre `yarn install` lokalt må du logge inn mot Github package registry. Legg til følgende i .bashrc eller .zshrc lokalt på din maskin:
I .bashrc eller .zshrc:

`export NPM_AUTH_TOKEN=github_pat`

Hvor github_pat er din personal access token laget på github (settings -> developer settings). Husk `read:packages`-rettighet og enable SSO når du oppdaterer/lager PAT.

### .env.local-fil

I tillegg må du kopiere `.env-template` til `.env.local` for å kunne kjøre lokalt.

### Kjøre lokalt

Start `behandlingsflyt` backend lokalt ved å kjøre `TestApp`-klassen fra IntelliJ (TODO: hvordan kjøre fra kommandolinjen?)

```
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
