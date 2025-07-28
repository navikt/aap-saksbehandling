import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';

import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { render } from 'lib/test/CustomRender';
import { MineOppgaverTabell } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabell';

const oppgaver: Oppgave[] = [
  {
    id: 29821,
    personIdent: '23448824012',
    personNavn: 'RIKTIG  SERVITRISE',
    saksnummer: '4N8oWCW',
    behandlingRef: '452b8eaf-93b9-45a7-baad-1cda30c43127',
    journalpostId: null,
    enhet: '0417',
    oppfølgingsenhet: null,
    behandlingOpprettet: '2025-04-24T12:39:29.235',
    avklaringsbehovKode: '5003',
    status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
    behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
    påVentTil: '2025-05-22',
    påVentÅrsak: 'VENTER_PÅ_OPPLYSNINGER',
    venteBegrunnelse: 'Hello Pello ',
    årsakerTilBehandling: ['MOTTATT_SØKNAD'],
    reservertAv: 'Z990742',
    reservertTidspunkt: '2025-05-20T13:56:50.224',
    opprettetAv: 'Kelvin',
    opprettetTidspunkt: '2025-04-24T12:39:32.737',
    endretAv: 'Kelvin',
    endretTidspunkt: '2025-05-21T09:28:56.725',
    versjon: 8,
    markeringer: []
  },
];

describe('Mine oppgaver tabell', () => {
  beforeEach(() => render(<MineOppgaverTabell oppgaver={oppgaver} revalidateFunction={vi.fn()} />));

  it('Skal inneholde korrekte kolonner ', () => {
    const kolonner = ['Navn', 'Fnr', 'ID', 'Behandlingstype', 'Beh. opprettet', 'Årsak', 'Oppgave'];

    kolonner.forEach((kolonne) => {
      const column = screen.getByRole('columnheader', { name: kolonne });
      expect(column).toBeVisible();
    });
  });

  it('Skal inneholde kolonner som kan sorteres ', () => {
    const kolonnerSomKanSorteres = ['Navn', 'Fnr', 'ID', 'Beh. opprettet', 'Årsak'];
    kolonnerSomKanSorteres.forEach((kolonne) => {
      const column = screen.getByRole('button', { name: kolonne });
      expect(column).toBeVisible();
    });
  });

  it('Skal inneholde kolonner som ikke kan sorteres', () => {
    const kolonnerSomIkkeKanSorteres = ['Behandlingstype', 'Oppgave'];
    kolonnerSomIkkeKanSorteres.forEach((kolonne) => {
      const column = screen.queryByRole('button', { name: kolonne });
      expect(column).not.toBeInTheDocument();
    });
  });
});
