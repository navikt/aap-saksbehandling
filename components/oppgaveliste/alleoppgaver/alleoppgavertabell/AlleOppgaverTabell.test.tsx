import { describe, expect, it, vi } from 'vitest';
import { customRenderWithTildelOppgaveContext } from 'lib/test/CustomRender';
import { screen } from '@testing-library/react';
import { AlleOppgaverTabell } from 'components/oppgaveliste/alleoppgaver/alleoppgavertabell/AlleOppgaverTabell';
import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';

const baseOppgave: Oppgave = {
  id: 123,
  personIdent: '12345678910',
  behandlingRef: 'dgklasdf',
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
};

const oppgaver: Oppgave[] = [
  baseOppgave,
  {
    ...baseOppgave,
    behandlingRef: 'sdfgaf',
    reservertAv: 'ident2',
    reservertAvNavn: undefined,
  },
];

describe('AlleOppgaverTabell', () => {
  it('skal vise saksbehandlers navn når det finnes', async () => {
    customRenderWithTildelOppgaveContext(
      <AlleOppgaverTabell
        oppgaver={[oppgaver[0]]}
        revalidateFunction={vi.fn()}
        setValgteRader={vi.fn()}
        valgteRader={[]}
        setSortBy={() => {}}
        sort={undefined}
        aktivKø={undefined}
        visBeløpKolonne={false}
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
      <AlleOppgaverTabell
        oppgaver={[oppgaver[1]]}
        revalidateFunction={vi.fn()}
        setValgteRader={vi.fn()}
        valgteRader={[]}
        setSortBy={() => {}}
        sort={undefined}
        aktivKø={undefined}
        visBeløpKolonne={false}
      />,
      false
    );
    const saksbehandlerIdent = screen.getByText('ident2');
    expect(saksbehandlerIdent).toBeVisible();

    const saksbehandlernavn = screen.queryByText('Test Testesen');
    expect(saksbehandlernavn).not.toBeInTheDocument();
  });

  it('skal vise PÅ_VENT-indikator for tilbakekrevingsbehandling som er på vent', async () => {
    const tilbakekrevingPåVent: Oppgave = {
      ...baseOppgave,
      behandlingRef: 'tilbakekreving-behandling',
      behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.TILBAKEKREVING,
      påVentTil: '2025-12-31',
      påVentÅrsak: 'AVVENTER_BRUKERUTTALELSE',
    };

    customRenderWithTildelOppgaveContext(
      <AlleOppgaverTabell
        oppgaver={[tilbakekrevingPåVent]}
        revalidateFunction={vi.fn()}
        setValgteRader={vi.fn()}
        valgteRader={[]}
        setSortBy={() => {}}
        sort={undefined}
        aktivKø={undefined}
        visBeløpKolonne={false}
      />,
      false
    );

    const påVentKnapp = screen.getByTitle('Oppgave på vent').closest('button');
    expect(påVentKnapp).toBeInTheDocument();
  });
});

