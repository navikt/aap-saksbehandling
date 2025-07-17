import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render } from 'lib/test/CustomRender';
import { screen } from '@testing-library/react';
import { AlleOppgaverActionMenu } from 'components/oppgaveliste/alleoppgaver/alleoppgaveractionmenu/AlleOppgaverActionMenu';

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

describe('AlleOppgaverActionMenu', () => {
  const user = userEvent.setup();

  it('skal ha en knapp for å åpne oppgaven', async () => {
    render(<AlleOppgaverActionMenu oppgave={oppgave} revalidateFunction={vi.fn()} />);
    const menu = screen.getByRole('button', { name: 'Oppgavemeny' });
    await user.click(menu);
    const åpneOppgave = screen.getByText('Åpne oppgave');
    expect(åpneOppgave).toBeVisible();
  });

  it('skal ha en knapp for å frigi oppgaven hvis oppgaven er reservert', async () => {
    const reservertOppgave = { ...oppgave, reservertAv: 'saksbehandler' };
    render(<AlleOppgaverActionMenu oppgave={reservertOppgave} revalidateFunction={vi.fn()} />);
    const menu = screen.getByRole('button', { name: 'Oppgavemeny' });
    await user.click(menu);
    const frigiOppgave = screen.getByText('Frigi oppgave');
    expect(frigiOppgave).toBeVisible();
  });

  it('skal ikke ha knapp for å frigi hvis oppgave ikke er reservert', async () => {
    render(<AlleOppgaverActionMenu oppgave={oppgave} revalidateFunction={vi.fn()} />);
    const menu = screen.getByRole('button', { name: 'Oppgavemeny' });
    await user.click(menu);
    const frigiOppgave = screen.queryByText('Frigi oppgave');
    expect(frigiOppgave).not.toBeInTheDocument();
  });
});
