import {
  NoNavAapOppgaveBehandlingskontekstResponseBehandlingstype,
  NoNavAapOppgaveListeOppgaveMetadataResponseStatus,
  NoNavAapOppgaveReturInformasjonDtoRsaker,
  NoNavAapOppgaveReturInformasjonDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { addDays, format } from 'date-fns';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { describe, expect, it } from 'vitest';

import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';

const renderWithFlags = (ui: React.ReactElement) =>
  render(<FeatureFlagProvider flags={mockedFlags}>{ui}</FeatureFlagProvider>);

const oppgave: OppgaveMedKontekst = {
  årsakTilOpprettelse: undefined,
  avklaringsbehovKode: '',
  behandlingOpprettet: '',
  behandlingskontekst: {
    behandlingsreferanse: '',
    behandlingstype: NoNavAapOppgaveBehandlingskontekstResponseBehandlingstype.F_RSTEGANGSBEHANDLING,
  },
  oppgaveMetadata: {
    id: 0,
    opprettetTidspunkt: '',
    status: NoNavAapOppgaveListeOppgaveMetadataResponseStatus.OPPRETTET,
    versjon: 0,
  },
  personOgEnhet: {
    enhet: '',
    personIdent: '',
  },
  vurderingsbehov: [],
  oppgavelisteTags: {
    markeringer: [],
    skjermingInfo: {
      erSkjermet: false,
      harFortroligAdresse: false,
      harStrengtFortroligAdresse: false,
    },
  },
};

const user = userEvent.setup();

describe('OppgaveInformasjon', () => {
  it('Skal vise på vent ikon dersom oppgave er på vent', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            påVentInfo: { påVentTil: addDays(new Date(), 1).toDateString() },
          },
        }}
      />
    );
    expect(screen.getByRole('img', { name: 'Oppgave på vent' })).toBeVisible();
  });

  it('Skal vise ikon for mottat svar fra behandler dersom oppgave er markert med harUlesteDokumenter', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{ ...oppgave, oppgavelisteTags: { ...oppgave.oppgavelisteTags, harUlesteDokumenter: true } }}
      />
    );
    expect(screen.getByRole('img', { name: 'Mottatt svar fra behandler' })).toBeVisible();
  });

  it('Skal vise både på vent ikon og mottat svar fra behandler ikon dersom saken er på vent og mottat svar', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            påVentInfo: { påVentTil: addDays(new Date(), 1).toDateString() },
            harUlesteDokumenter: true,
          },
        }}
      />
    );
    expect(screen.getByRole('img', { name: 'Mottatt svar fra behandler' })).toBeVisible();
    expect(screen.getByRole('img', { name: 'Oppgave på vent' })).toBeVisible();
  });

  it('skal vise ikon for returinformasjon om oppgaven er returnert', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            returInformasjon: {
              status: NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_BESLUTTER,
              begrunnelse: 'Hei',
              årsaker: [NoNavAapOppgaveReturInformasjonDtoRsaker.FEIL_LOVANVENDELSE],
              endretAv: 'Foffern',
            },
          },
        }}
      />
    );

    const icon = screen.getByRole('img', { name: 'Retur fra beslutter' });
    expect(icon).toBeVisible();

    user.click(icon);

    const tekst = screen.getByText('Begrunnelse');
    expect(tekst).toBeVisible();
  });

  it('skal vise hvem som gjorde forrige kvalitetssikring hvis retur fra veileder', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            returInformasjon: {
              status: NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_VEILEDER,
              begrunnelse: 'Hei',
              årsaker: [],
              endretAv: 'Veileder',
            },
            forrigeKvalitetssikrerInfo: {
              forrigeKvalitetssikrerIdent: 'T1234',
              forrigeKvalitetssikrerNavn: 'Kvalitetssikrer',
            },
          },
        }}
      />
    );

    const icon = screen.getByRole('img', { name: 'Retur fra veileder' });
    expect(icon).toBeVisible();

    user.click(icon);

    const tekst = screen.getByText('Sist kvalitetssikret av');
    expect(tekst).toBeVisible();
  });

  it('skal vise ikon for adressebeskyttelse hvis brukeren er kode 7', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            skjermingInfo: {
              harStrengtFortroligAdresse: false,
              harFortroligAdresse: true,
              erSkjermet: false,
            },
          },
        }}
      />
    );
    expect(screen.getByRole('img', { name: 'Adressebeskyttelse Ikon' })).toBeVisible();
  });

  it('skal ikke vise ikon for adressebeskyttelse hvis bruker ikke er kode 7', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            skjermingInfo: {
              harStrengtFortroligAdresse: false,
              harFortroligAdresse: false,
              erSkjermet: false,
            },
          },
        }}
      />
    );
    expect(screen.queryByRole('img', { name: 'Adressebeskyttelse Ikon' })).not.toBeInTheDocument();
  });

  it('skal vise egen ansatt-ikon når oppgave er egen ansatt', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            skjermingInfo: {
              harStrengtFortroligAdresse: false,
              harFortroligAdresse: false,
              erSkjermet: true,
            },
          },
        }}
      />
    );
    expect(screen.getByRole('img', { name: 'Adressebeskyttelse Ikon' })).toBeVisible();
  });

  it('skal ikke vise egen ansatt-ikon når bruker ikke er egen ansatt', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            skjermingInfo: {
              harStrengtFortroligAdresse: false,
              harFortroligAdresse: false,
              erSkjermet: false,
            },
          },
        }}
      />
    );
    expect(screen.queryByRole('img', { name: 'Adressebeskyttelse Ikon' })).not.toBeInTheDocument();
  });

  it('skal vise ventefrist utløpt-ikon om ventefrist er utløpt', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            forrigePåVentInfo: {
              påVentTil: '2026-01-04',
            },
          },
        }}
      />
    );
    expect(screen.getByRole('img', { name: 'Ventefrist utløpt' })).toBeVisible();
  });

  it('skal ikke vise ventefrist utløpt-ikon når oppgave ikke har ventefrist', () => {
    renderWithFlags(<OppgaveInformasjon oppgave={oppgave} />);
    expect(screen.queryByRole('img', { name: 'Ventefrist utløpt' })).not.toBeInTheDocument();
  });

  it('skal vise ventefrist utløpt-ikon dersom påVentTil er passert dagens dato', () => {
    renderWithFlags(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          oppgavelisteTags: {
            ...oppgave.oppgavelisteTags,
            forrigePåVentInfo: {
              påVentTil: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
            },
          },
        }}
      />
    );
    expect(screen.getByRole('img', { name: 'Ventefrist utløpt' })).toBeVisible();
    expect(screen.queryByRole('img', { name: 'Oppgave på vent' })).not.toBeInTheDocument();
  });
});
