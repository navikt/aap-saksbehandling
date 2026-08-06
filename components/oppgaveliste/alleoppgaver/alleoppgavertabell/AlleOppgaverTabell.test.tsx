import {
  NoNavAapOppgaveBehandlingskontekstResponseBehandlingstype,
  NoNavAapOppgaveListeOppgaveMetadataResponseStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { screen } from '@testing-library/react';
import { customRenderWithTildelOppgaveContext } from 'lib/test/CustomRender';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { describe, expect, it, vi } from 'vitest';

import { AlleOppgaverTabell } from 'components/oppgaveliste/alleoppgaver/alleoppgavertabell/AlleOppgaverTabell';

const baseOppgave: OppgaveMedKontekst = {
  årsakTilOpprettelse: undefined,
  avklaringsbehovKode: '',
  behandlingOpprettet: '2026-01-04',
  behandlingskontekst: {
    behandlingsreferanse: '',
    behandlingstype: NoNavAapOppgaveBehandlingskontekstResponseBehandlingstype.F_RSTEGANGSBEHANDLING,
  },
  oppgaveMetadata: {
    id: 0,
    opprettetTidspunkt: '2026-01-04',
    status: NoNavAapOppgaveListeOppgaveMetadataResponseStatus.OPPRETTET,
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
  reservertAv: 'z123',
  reservertAvNavn: 'Test Testesen',
};

const oppgaver: OppgaveMedKontekst[] = [
  baseOppgave,
  {
    ...baseOppgave,
    behandlingskontekst: {
      ...baseOppgave.behandlingskontekst,
      behandlingsreferanse: 'sdfgaf',
    },
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
    const tilbakekrevingPåVent: OppgaveMedKontekst = {
      ...baseOppgave,
      behandlingskontekst: {
        ...baseOppgave.behandlingskontekst,
        behandlingsreferanse: 'tilbakekreving-behandling',
        behandlingstype: NoNavAapOppgaveBehandlingskontekstResponseBehandlingstype.TILBAKEKREVING,
      },
      oppgavelisteTags: {
        ...baseOppgave.oppgavelisteTags,
        påVentInfo: {
          påVentTil: '2025-12-31',
          påVentÅrsak: 'AVVENTER_BRUKERUTTALELSE',
        },
      },
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
