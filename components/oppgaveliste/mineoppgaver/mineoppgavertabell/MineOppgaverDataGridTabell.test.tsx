import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRenderWithTildelOppgaveContext } from 'lib/test/CustomRender';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MineOppgaverDataGridTabell } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverDataGridTabell';

const oppgaver: OppgaveMedKontekst[] = [
  {
    årsakTilOpprettelse: undefined,
    avklaringsbehovKode: '',
    behandlingOpprettet: '2026-01-04',
    behandlingskontekst: {
      behandlingsreferanse: '',
      behandlingstype: 'FØRSTEGANGSBEHANDLING',
    },
    oppgaveMetadata: {
      id: 0,
      opprettetTidspunkt: '2026-01-04',
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
  },
];

describe('Mine oppgaver DataGrid-tabell', () => {
  const setSortBy = vi.fn();

  beforeEach(() =>
    customRenderWithTildelOppgaveContext(
      <MineOppgaverDataGridTabell
        oppgaver={oppgaver}
        setSortBy={setSortBy}
        sort={undefined}
        revalidateFunction={vi.fn()}
      />,
      false
    )
  );

  it('Skal sende backend-nøkkelen for kolonnen når bruker sorterer', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Fnr' }));

    expect(setSortBy).toHaveBeenCalledWith('PERSONIDENT');
  });

  it('Skal inneholde korrekte kolonner ', () => {
    const kolonner = ['Navn', 'Fnr', 'Sak', 'Behandlingstype', 'Beh. opprettet', 'Vurderingsbehov', 'Oppgave'];

    kolonner.forEach((kolonne) => {
      const column = screen.getByRole('columnheader', { name: kolonne });
      expect(column).toBeVisible();
    });
  });

  it('Skal inneholde kolonner som kan sorteres ', () => {
    const kolonnerSomKanSorteres = ['Fnr', 'Sak', 'Beh. opprettet', 'Årsak', 'Oppgave', 'Oppg. opprettet'];
    kolonnerSomKanSorteres.forEach((kolonne) => {
      const column = screen.getByRole('button', { name: kolonne });
      expect(column).toBeVisible();
    });
  });
});
