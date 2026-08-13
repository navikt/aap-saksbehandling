import { screen } from '@testing-library/react';
import { customRenderWithTildelOppgaveContext } from 'lib/test/CustomRender';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MineOppgaverTabell } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabell';

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

describe('Mine oppgaver tabell', () => {
  beforeEach(() =>
    customRenderWithTildelOppgaveContext(
      <MineOppgaverTabell oppgaver={oppgaver} setSortBy={() => {}} sort={undefined} revalidateFunction={vi.fn()} />,
      false
    )
  );

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
