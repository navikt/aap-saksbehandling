import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRenderWithTildelOppgaveContext } from 'lib/test/CustomRender';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { describe, expect, it, vi } from 'vitest';

import { AlleOppgaverActionMenu } from 'components/oppgaveliste/alleoppgaver/alleoppgaveractionmenu/AlleOppgaverActionMenu';

const oppgave: OppgaveMedKontekst = {
  årsakTilOpprettelse: undefined,
  avklaringsbehovKode: '',
  behandlingOpprettet: '',
  behandlingskontekst: {
    behandlingsreferanse: '',
    behandlingstype: 'FØRSTEGANGSBEHANDLING',
  },
  oppgaveMetadata: {
    id: 0,
    opprettetTidspunkt: '',
    status: 'OPPRETTET',
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

const setSync = () => undefined;

describe('AlleOppgaverActionMenu', () => {
  const user = userEvent.setup();

  it('skal ha en knapp for å åpne oppgaven', async () => {
    customRenderWithTildelOppgaveContext(
      <AlleOppgaverActionMenu oppgave={oppgave} setVisSynkroniserEnhetModal={setSync} revalidateFunction={vi.fn()} />,
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
      <AlleOppgaverActionMenu
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
      <AlleOppgaverActionMenu oppgave={oppgave} setVisSynkroniserEnhetModal={setSync} revalidateFunction={vi.fn()} />,
      false
    );
    const menu = screen.getByRole('button', { name: 'Oppgavemeny' });
    await user.click(menu);
    const frigiOppgave = screen.queryByText('Frigi oppgave');
    expect(frigiOppgave).not.toBeInTheDocument();
  });
});
