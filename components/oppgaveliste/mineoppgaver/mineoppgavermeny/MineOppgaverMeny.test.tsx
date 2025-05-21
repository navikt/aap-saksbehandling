import { describe, expect, it, vi } from 'vitest';
import { render } from 'lib/test/CustomRender';
import { MineOppgaverMeny } from 'components/oppgaveliste/mineoppgaver/mineoppgavermeny/MineOppgaverMeny';
import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const oppgaver: Oppgave = {
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

describe('MineOppgaverMeny', () => {
  const user = userEvent.setup();

  it('skal ha en knapp for å behandle oppgaven', () => {
    render(<MineOppgaverMeny oppgave={oppgaver} setFeilmelding={vi.fn()} revalidateFunction={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Behandle' });
    expect(button).toBeVisible();
  });

  it('skal ha en knapp for å frigi oppgaven', async () => {
    render(<MineOppgaverMeny oppgave={oppgaver} setFeilmelding={vi.fn()} revalidateFunction={vi.fn()} />);
    const menu = screen.getByRole('img', { name: 'Meny' });
    await user.click(menu);
    const button = screen.getByRole('button', { name: 'Frigi oppgave' });
    expect(button).toBeVisible();
  });
});
