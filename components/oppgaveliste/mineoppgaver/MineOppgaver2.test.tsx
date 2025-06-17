import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it } from 'vitest';
import { MineOppgaver2 } from 'components/oppgaveliste/mineoppgaver/MineOppgaver2';
import { OppgavelisteResponse } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { mockSWRImplementation } from 'lib/test/testUtil';
import { FetchResponse } from 'lib/utils/api';
import userEvent from '@testing-library/user-event';

const oppgaver: OppgavelisteResponse = {
  oppgaver: [
    {
      avklaringsbehovKode: '5005',
      behandlingOpprettet: '2020-01-01',
      behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
      enhet: '0422',
      opprettetAv: 'Kelvin',
      opprettetTidspunkt: '2020-01-01',
      status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
      versjon: 0,
      årsakerTilBehandling: [],
      personIdent: '12345678910',
    },
    {
      avklaringsbehovKode: '5004',
      behandlingOpprettet: '2020-03-01',
      behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.REVURDERING,
      enhet: '0422',
      opprettetAv: 'Kelvin',
      opprettetTidspunkt: '2020-03-01',
      status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
      versjon: 0,
      årsakerTilBehandling: [],
      personIdent: '10987654321',
    },
  ],
  antallTotalt: 2,
  antallGjenstaaende: 0,
};

const response: FetchResponse<OppgavelisteResponse> = {
  type: 'SUCCESS',
  status: 200,
  data: oppgaver,
};

beforeEach(() => {
  mockSWRImplementation({
    'api/mine-oppgaver': response,
  });
});

const user = userEvent.setup();

describe('Mine oppgaver', () => {
  it('Skal vise oppgavene i listen', async () => {
    render(<MineOppgaver2 />);
    await åpneFiltrering();

    screen.logTestingPlaygroundURL();
  });
});

async function åpneFiltrering() {
  const knapp = screen.getByRole('button', { name: 'Filtrer listen' });
  await user.click(knapp);
}
