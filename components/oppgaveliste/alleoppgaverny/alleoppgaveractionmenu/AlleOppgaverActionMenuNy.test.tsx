import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { customRenderWithTildelOppgaveContext } from 'lib/test/CustomRender';
import { screen } from '@testing-library/react';
import { AlleOppgaverActionMenuNy } from 'components/oppgaveliste/alleoppgaverny/alleoppgaveractionmenu/AlleOppgaverActionMenuNy';

const oppgave: Oppgave = {
  vurderingsbehov: [],
  avklaringsbehovKode: '',
  behandlingOpprettet: '',
  behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
  enhet: '',
  opprettetAv: '',
  opprettetTidspunkt: '',
  status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
  versjon: 0,
  årsakerTilBehandling: [],
  markeringer: [],
  enhetForKø: '4491',
  erPåVent: false,
};

const setSync = () => undefined;

describe('AlleOppgaverActionMenu', () => {
  const user = userEvent.setup();

  it('skal ha en knapp for å åpne oppgaven', async () => {
    customRenderWithTildelOppgaveContext(
      <AlleOppgaverActionMenuNy oppgave={oppgave} setVisSynkroniserEnhetModal={setSync} revalidateFunction={vi.fn()} />,
      false
    );
    const menu = screen.getByRole('button', { name: 'Oppgavemeny' });
    await user.click(menu);
    const åpneOppgave = screen.getByText('Åpne oppgave');
    expect(åpneOppgave).toBeVisible();
  });

  it('skal ha en knapp for å frigi oppgaven hvis oppgaven er reservert', async () => {
    const reservertOppgave = { ...oppgave, reservertAv: 'saksbehandler' };
    customRenderWithTildelOppgaveContext(
      <AlleOppgaverActionMenuNy
        oppgave={reservertOppgave}
        setVisSynkroniserEnhetModal={setSync}
        revalidateFunction={vi.fn()}
      />,
      false
    );
    const menu = screen.getByRole('button', { name: 'Oppgavemeny' });
    await user.click(menu);
    const frigiOppgave = screen.getByText('Frigi oppgave');
    expect(frigiOppgave).toBeVisible();
  });

  it('skal ikke ha knapp for å frigi hvis oppgave ikke er reservert', async () => {
    customRenderWithTildelOppgaveContext(
      <AlleOppgaverActionMenuNy oppgave={oppgave} setVisSynkroniserEnhetModal={setSync} revalidateFunction={vi.fn()} />,
      false
    );
    const menu = screen.getByRole('button', { name: 'Oppgavemeny' });
    await user.click(menu);
    const frigiOppgave = screen.queryByText('Frigi oppgave');
    expect(frigiOppgave).not.toBeInTheDocument();
  });
});
