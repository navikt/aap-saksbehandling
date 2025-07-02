import { describe, expect, it } from 'vitest';
import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
  NoNavAapOppgaveReturInformasjonRsaker,
  NoNavAapOppgaveReturInformasjonStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { addDays } from 'date-fns';
import { render, screen } from '@testing-library/react';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import userEvent from '@testing-library/user-event';

const oppgave: Oppgave = {
  avklaringsbehovKode: '',
  behandlingOpprettet: '',
  behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
  enhet: '',
  opprettetAv: '',
  opprettetTidspunkt: '',
  status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
  versjon: 0,
  årsakerTilBehandling: [],
};

const user = userEvent.setup();

describe('OppgaveInformasjon', () => {
  it('Skal vise på vent ikon dersom oppgave er på vent', () => {
    render(<OppgaveInformasjon oppgave={{ ...oppgave, påVentTil: addDays(new Date(), 1).toDateString() }} />);
    expect(screen.getByRole('img', { name: 'Oppgave på vent' })).toBeVisible();
  });

  it('Skal vise ikon for mottat svar fra behandler dersom oppgave er markert med harUlesteDokumenter', () => {
    render(<OppgaveInformasjon oppgave={{ ...oppgave, harUlesteDokumenter: true }} />);
    expect(screen.getByRole('img', { name: 'Mottatt svar fra behandler' })).toBeVisible();
  });

  it('Skal vise både på vent ikon og mottat svar fra behandler ikon dersom saken er på vent og mottat svar', () => {
    render(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          påVentTil: addDays(new Date(), 1).toDateString(),
          harUlesteDokumenter: true,
        }}
      />
    );
    expect(screen.getByRole('img', { name: 'Mottatt svar fra behandler' })).toBeVisible();
    expect(screen.getByRole('img', { name: 'Oppgave på vent' })).toBeVisible();
  });

  it('skal vise ikon for returinformasjon om oppgaven er returnert', () => {
    render(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          returInformasjon: {
            status: NoNavAapOppgaveReturInformasjonStatus.RETUR_FRA_BESLUTTER,
            begrunnelse: 'Hei',
            årsaker: [NoNavAapOppgaveReturInformasjonRsaker.FEIL_LOVANVENDELSE],
            endretAv: 'Foffern',
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

  it('skal vise ikon for adressebeskyttelse hvis bruker er kode 7', () => {
    render(<OppgaveInformasjon oppgave={{ ...oppgave, harFortroligAdresse: true }} />);
    expect(screen.getByRole('img', { name: 'Adressebeskyttelse Ikon' })).toBeVisible();
  });

  it('skal ikke vise ikon for adressebeskyttelse hvis bruker ikke er kode 7', () => {
    render(<OppgaveInformasjon oppgave={{ ...oppgave, harFortroligAdresse: false }} />);
    expect(screen.queryByRole('img', { name: 'Adressebeskyttelse Ikon' })).not.toBeInTheDocument();
  });
});
