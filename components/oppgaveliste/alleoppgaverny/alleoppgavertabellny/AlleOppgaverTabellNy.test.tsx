import { describe, expect, it, vi } from 'vitest';
import { customRenderWithTildelOppgaveContext } from 'lib/test/CustomRender';
import { screen } from '@testing-library/react';
import { AlleOppgaverTabellNy } from 'components/oppgaveliste/alleoppgaverny/alleoppgavertabellny/AlleOppgaverTabellNy';
import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';

const oppgaver: Oppgave[] = [
  {
    vurderingsbehov: [],
    avklaringsbehovKode: '',
    behandlingOpprettet: '2025-02-09',
    behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
    enhet: '',
    opprettetAv: '',
    opprettetTidspunkt: '2025-02-09',
    status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
    versjon: 0,
    årsakerTilBehandling: [],
    markeringer: [],
    reservertAv: 'ident',
    reservertAvNavn: 'Test Testesen',
    enhetForKø: '4491',
    erPåVent: false,
  },
  {
    vurderingsbehov: [],
    avklaringsbehovKode: '',
    behandlingOpprettet: '2025-02-09',
    behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
    enhet: '',
    opprettetAv: '',
    opprettetTidspunkt: '2025-02-09',
    status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
    versjon: 0,
    årsakerTilBehandling: [],
    markeringer: [],
    reservertAv: 'ident2',
    enhetForKø: '4491',
    erPåVent: false,
  },
];

describe('AlleOppgaverTabell', () => {
  it('skal vise saksbehandlers navn når det finnes', async () => {
    customRenderWithTildelOppgaveContext(
      <AlleOppgaverTabellNy
        oppgaver={[oppgaver[0]]}
        revalidateFunction={vi.fn()}
        setValgteRader={vi.fn()}
        valgteRader={[]}
        setSortBy={() => {}}
        sort={undefined}
      />,
      false
    );
    const saksbehandlernavn = screen.getByText('Test Testesen');
    expect(saksbehandlernavn).toBeVisible();

    const ident = screen.queryByText('ident');
    expect(ident).not.toBeInTheDocument();
  });

  it('skal vise saksbehandlers ident når navn ikke finnes', async () => {
    customRenderWithTildelOppgaveContext(
      <AlleOppgaverTabellNy
        oppgaver={[oppgaver[1]]}
        revalidateFunction={vi.fn()}
        setValgteRader={vi.fn()}
        valgteRader={[]}
        setSortBy={() => {}}
        sort={undefined}
      />,
      false
    );
    const saksbehandlerIdent = screen.getByText('ident2');
    expect(saksbehandlerIdent).toBeVisible();

    const saksbehandlernavn = screen.queryByText('Test Testesen');
    expect(saksbehandlernavn).not.toBeInTheDocument();
  });
});
