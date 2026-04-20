import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { useFiltrerteOppgaver } from 'components/oppgaveliste/mineoppgaver/MineOppgaverHook';
import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';

const baseOppgave: Oppgave = {
  id: 1,
  personIdent: '12345678910',
  personNavn: 'Test Testesen',
  saksnummer: 'SAK001',
  behandlingRef: 'ref-001',
  journalpostId: null,
  enhet: '0300',
  oppfølgingsenhet: null,
  behandlingOpprettet: '2025-01-15T10:00:00.000',
  avklaringsbehovKode: '5003',
  status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
  behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.F_RSTEGANGSBEHANDLING,
  påVentTil: null,
  påVentÅrsak: null,
  venteBegrunnelse: null,
  årsakerTilBehandling: [],
  reservertAv: null,
  reservertTidspunkt: null,
  opprettetAv: 'Kelvin',
  opprettetTidspunkt: '2025-01-15T10:00:00.000',
  endretAv: 'Kelvin',
  endretTidspunkt: '2025-01-15T10:00:00.000',
  versjon: 1,
  markeringer: [],
  vurderingsbehov: [],
  enhetForKø: '0300',
  erÅpen: true,
  erPåVent: false,
};

const lagOppgaveMedBeløp = (id: number, beløp: number): Oppgave => ({
  ...baseOppgave,
  id,
  tilbakekrevingsVarsDto: {
    tilbakekrevings_URL: 'http://example.com',
    tilbakekrevings_beløp: beløp,
  },
});

const lagOppgaveUtenBeløp = (id: number): Oppgave => ({
  ...baseOppgave,
  id,
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <FeatureFlagProvider flags={{ ...mockedFlags, TilbakekrevingBelopFilter: true }}>
    {children}
  </FeatureFlagProvider>
);

const wrapperUtenFeatureFlag = ({ children }: { children: ReactNode }) => (
  <FeatureFlagProvider flags={{ ...mockedFlags, TilbakekrevingBelopFilter: false }}>
    {children}
  </FeatureFlagProvider>
);

describe('useFiltrerteOppgaver — tilbakekrevingBeløp-filter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const oppgaver = [
    lagOppgaveMedBeløp(1, 500),
    lagOppgaveMedBeløp(2, 2000),
    lagOppgaveMedBeløp(3, 10000),
    lagOppgaveUtenBeløp(4),
  ];

  it('returnerer alle oppgaver når ingen beløpsfiltre er satt', () => {
    const { result } = renderHook(
      () => useFiltrerteOppgaver({ oppgaver, filter: {} }),
      { wrapper }
    );

    act(() => { vi.advanceTimersByTime(300); });

    expect(result.current).toHaveLength(4);
  });

  it('filtrerer bort oppgaver med beløp under tilbakekrevingBeløpFom', () => {
    const { result } = renderHook(
      () => useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpFom: '1000' } }),
      { wrapper }
    );

    act(() => { vi.advanceTimersByTime(300); });

    const ids = result.current.map((o) => o.id);
    expect(ids).toContain(2);
    expect(ids).toContain(3);
    expect(ids).not.toContain(1);
  });

  it('filtrerer bort oppgaver med beløp over tilbakekrevingBeløpTom', () => {
    const { result } = renderHook(
      () => useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpTom: '5000' } }),
      { wrapper }
    );

    act(() => { vi.advanceTimersByTime(300); });

    const ids = result.current.map((o) => o.id);
    expect(ids).toContain(1);
    expect(ids).toContain(2);
    expect(ids).not.toContain(3);
  });

  it('filtrerer med både fom og tom satt', () => {
    const { result } = renderHook(
      () => useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpFom: '1000', tilbakekrevingBeløpTom: '5000' } }),
      { wrapper }
    );

    act(() => { vi.advanceTimersByTime(300); });

    const ids = result.current.map((o) => o.id);
    expect(ids).toEqual([2]);
  });

  it('ekskluderer oppgaver uten tilbakekrevingsbeløp når beløpsfilter er satt', () => {
    const { result } = renderHook(
      () => useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpFom: '100' } }),
      { wrapper }
    );

    act(() => { vi.advanceTimersByTime(300); });

    const ids = result.current.map((o) => o.id);
    expect(ids).not.toContain(4);
  });

  it('ignorerer beløpsfilter når feature-flagget er av', () => {
    const { result } = renderHook(
      () => useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpFom: '1000' } }),
      { wrapper: wrapperUtenFeatureFlag }
    );

    act(() => { vi.advanceTimersByTime(300); });

    expect(result.current).toHaveLength(4);
  });
});
