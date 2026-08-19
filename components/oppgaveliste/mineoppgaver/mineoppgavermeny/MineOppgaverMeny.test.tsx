import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRenderWithTildelOppgaveContext } from 'lib/test/CustomRender';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { describe, expect, it, vi } from 'vitest';

import { MineOppgaverMeny } from 'components/oppgaveliste/mineoppgaver/mineoppgavermeny/MineOppgaverMeny';

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
describe('MineOppgaverMeny', () => {
  const user = userEvent.setup();

  it('skal ha en knapp for å behandle oppgaven', () => {
    customRenderWithTildelOppgaveContext(
      <MineOppgaverMeny
        oppgave={oppgave}
        setFeilmelding={vi.fn()}
        revalidateFunction={vi.fn()}
        setÅpenModal={vi.fn()}
      />,
      false
    );
    const button = screen.getByRole('button', { name: 'Behandle' });
    expect(button).toBeVisible();
  });

  it('skal ha en knapp for å frigi oppgaven', async () => {
    customRenderWithTildelOppgaveContext(
      <MineOppgaverMeny
        oppgave={oppgave}
        setFeilmelding={vi.fn()}
        revalidateFunction={vi.fn()}
        setÅpenModal={vi.fn()}
      />,
      false
    );
    const menu = screen.getByRole('img', { name: 'Meny' });
    await user.click(menu);
    const button = screen.getByRole('button', { name: 'Frigi oppgave' });
    expect(button).toBeVisible();
  });
});
