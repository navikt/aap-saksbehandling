# Umami-hendelsestyper i denne kodebasen

`UmamiKelvinEvent` (`lib/utils/umami/kelvinEvent.ts`) er en diskriminert union på `name`-feltet, med varianter definert i egne filer under `lib/utils/umami/`. Payloaden er `{ name, data }`, og `data` sendes ferdig strukturert fra hjelpefunksjonene.

```mermaid
classDiagram
  class UmamiKelvinEvent {
    <<union>>
  }
  class UmamiVarighetEvent {
    name: UmamiStegVarighetTag
    data: object
    data.varighet_sekunder: number
    data.brevtype?: string
  }
  class UmamiHendelserVarighetEvent {
    name: UmamiHendelserSerieNavn
    data: object
    data.hendelser_serie: string
    data.hendelser_serie_id: string
    data.delhendelse: string
    data.varighet_sekunder: number
    data.varighet_sekunder_siden_forrige?: number
    data.tidsstempel: number
  }
  class UmamiLenkeKlikkEvent {
    name: "EKSTERN_LENKE_KLIKK"
    data: object
    data.lenketekst: string
    data.steg?: StegType
  }
  class UmamiNavigeringEvent {
    name: UmamiNavigeringNavn
    data: object
    data.inngang: Behandling/Saksoversikt/Oppgave
    data.reserverer?: "true"
  }
  class UmamiBehandlerdialogEvent {
    name: UMAMI_BEHANDLERDIALOG_NAVN
    data: {}
  }
  UmamiKelvinEvent <|-- UmamiVarighetEvent : STEG_..._VARIGHET
  UmamiKelvinEvent <|-- UmamiHendelserVarighetEvent : ..._HENDELSER_VARIGHET
  UmamiKelvinEvent <|-- UmamiLenkeKlikkEvent : EKSTERN_LENKE_KLIKK
  UmamiKelvinEvent <|-- UmamiNavigeringEvent : GÅ_TIL_.../..._OPPGAVE
  UmamiKelvinEvent <|-- UmamiBehandlerdialogEvent : BEHANDLERDIALOG_..._KLIKK
```

- **`UmamiVarighetEvent`** (`varighet.ts`) — tidsmåling for et behandlingssteg, tag `STEG_<KONTEKST>_VARIGHET`.
- **`UmamiHendelserVarighetEvent`** (`hendelserVarighet.ts`) — serie av tidsmålte delhendelser, tag `<KONTEKST>_HENDELSER_VARIGHET`.
- **`UmamiLenkeKlikkEvent`** (`lenkeKlikk.ts`) — klikk på ekstern lenke, tag `EKSTERN_LENKE_KLIKK`.
- **`UmamiNavigeringEvent`** (`navigering.ts`) — navigasjon/oppgavehandling, tag `GÅ_TIL_<MÅL>` eller `<HANDLING>_OPPGAVE`.
- **`UmamiBehandlerdialogEvent`** (`behandlerdialog.ts`) — brukerinitierte handlinger i dialog med behandler, tag `BEHANDLERDIALOG_<HANDLING>_KLIKK`.

Alle sendes via `clientLoggUmamiEvent(name, data)` (`client.ts`) → `POST /api/umami` (`app/api/umami/route.ts`) → `@umami/node`.

## Dialog med behandler

`loggUmamiBehandlerdialogKlikk(name)` sender kun hendelsesnavn, uten saks- eller personopplysninger:

- `BEHANDLERDIALOG_GÅ_TIL_SEND_FORESPØRSEL` — innsending av bestilling/dialogmelding etter skjemavalidering.
- `BEHANDLERDIALOG_SEND_FORESPØRSEL` — send purring.
- `BEHANDLERDIALOG_AVBRYT_PÅMINNELSE` — avbryt automatisk påminnelse.
- `BEHANDLERDIALOG_GJENOPPTA_PÅMINNELSE` — gjenoppta automatisk påminnelse.

Hendelsene måler brukerens handling før API-kallet, ikke om kallet lykkes.
