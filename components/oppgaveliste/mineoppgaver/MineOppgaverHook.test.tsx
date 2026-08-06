import {
  NoNavAapOppgaveBehandlingskontekstResponseBehandlingstype,
  NoNavAapOppgaveListeOppgaveMetadataResponseStatus,
} from '@navikt/aap-oppgave-typescript-types';
import { act, renderHook } from '@testing-library/react';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';
import { OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFiltrerteOppgaver } from 'components/oppgaveliste/mineoppgaver/MineOppgaverHook';

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
    opprettetTidspunkt: '',
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
};

const lagOppgaveMedBeløp = (id: number, beløp: number): OppgaveMedKontekst => ({
  ...baseOppgave,
  oppgaveMetadata: {
    ...baseOppgave.oppgaveMetadata,
    id: id,
  },
  tilbakekrevingsVars: {
    tilbakekrevings_URL: 'http://example.com',
    tilbakekrevings_beløp: beløp,
  },
});

const lagOppgaveUtenBeløp = (id: number): OppgaveMedKontekst => ({
  ...baseOppgave,
  oppgaveMetadata: {
    ...baseOppgave.oppgaveMetadata,
    id: id,
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <FeatureFlagProvider flags={{ ...mockedFlags, TilbakekrevingBelopFilter: true }}>{children}</FeatureFlagProvider>
);

const wrapperUtenFeatureFlag = ({ children }: { children: ReactNode }) => (
  <FeatureFlagProvider flags={{ ...mockedFlags, TilbakekrevingBelopFilter: false }}>{children}</FeatureFlagProvider>
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
    const { result } = renderHook(() => useFiltrerteOppgaver({ oppgaver, filter: {} }), { wrapper });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toHaveLength(4);
  });

  it('filtrerer bort oppgaver med beløp under tilbakekrevingBeløpFom', () => {
    const { result } = renderHook(
      () => useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpFom: '1000' } }),
      { wrapper }
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const ids = result.current.map((o) => o.oppgaveMetadata.id);
    expect(ids).toContain(2);
    expect(ids).toContain(3);
    expect(ids).not.toContain(1);
  });

  it('filtrerer bort oppgaver med beløp over tilbakekrevingBeløpTom', () => {
    const { result } = renderHook(
      () => useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpTom: '5000' } }),
      { wrapper }
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const ids = result.current.map((o) => o.oppgaveMetadata.id);
    expect(ids).toContain(1);
    expect(ids).toContain(2);
    expect(ids).not.toContain(3);
  });

  it('filtrerer med både fom og tom satt', () => {
    const { result } = renderHook(
      () =>
        useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpFom: '1000', tilbakekrevingBeløpTom: '5000' } }),
      { wrapper }
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const ids = result.current.map((o) => o.oppgaveMetadata.id);
    expect(ids).toEqual([2]);
  });

  it('ekskluderer oppgaver uten tilbakekrevingsbeløp når beløpsfilter er satt', () => {
    const { result } = renderHook(() => useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpFom: '100' } }), {
      wrapper,
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const ids = result.current.map((o) => o.oppgaveMetadata.id);
    expect(ids).not.toContain(4);
  });

  it('ignorerer beløpsfilter når feature-flagget er av', () => {
    const { result } = renderHook(
      () => useFiltrerteOppgaver({ oppgaver, filter: { tilbakekrevingBeløpFom: '1000' } }),
      { wrapper: wrapperUtenFeatureFlag }
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toHaveLength(4);
  });
});
