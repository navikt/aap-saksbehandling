import { describe, expect, it } from 'vitest';
import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { addDays } from 'date-fns';
import { render, screen } from '@testing-library/react';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';

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

describe('OppgaveInformasjon', () => {
  it('Skal vise på vent ikon dersom oppgave er på vent', () => {
    render(<OppgaveInformasjon oppgave={{ ...oppgave, påVentTil: addDays(new Date(), 1).toDateString() }} />);
    expect(screen.getByRole('img', { name: 'på vent ikon' })).toBeVisible();
  });

  it('Skal vise ikon for mottat svar fra behandler dersom årsakTilBehandling er MOTTATT_LEGEERKLÆRING', () => {
    render(<OppgaveInformasjon oppgave={{ ...oppgave, årsakerTilBehandling: ['MOTTATT_LEGEERKLÆRING'] }} />);
    expect(screen.getByRole('img', { name: 'Mottatt svar fra behandler' })).toBeVisible();
  });

  it('Skal vise ikon for mottat svar fra behandler dersom årsakTilBehandling er MOTTATT_AVVIST_LEGEERKLÆRING', () => {
    render(<OppgaveInformasjon oppgave={{ ...oppgave, årsakerTilBehandling: ['MOTTATT_AVVIST_LEGEERKLÆRING'] }} />);
    expect(screen.getByRole('img', { name: 'Mottatt svar fra behandler' })).toBeVisible();
  });

  it('Skal vise både på vent ikon og mottat svar fra behandler ikon dersom saken er på vent og mottat svar', () => {
    render(
      <OppgaveInformasjon
        oppgave={{
          ...oppgave,
          påVentTil: addDays(new Date(), 1).toDateString(),
          årsakerTilBehandling: ['MOTTATT_LEGEERKLÆRING'],
        }}
      />
    );
    expect(screen.getByRole('img', { name: 'Mottatt svar fra behandler' })).toBeVisible();
    expect(screen.getByRole('img', { name: 'på vent ikon' })).toBeVisible();
  });
});
