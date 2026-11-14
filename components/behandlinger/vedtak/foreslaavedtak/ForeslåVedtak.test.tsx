import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';
import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { customRender } from 'lib/test/CustomRender';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslaavedtak/ForeslåVedtak';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';

vi.mock('hooks/saksbehandling/BehandlingHook', () => ({
  useParamsMedType: () => ({ behandlingsreferanse: 'ref', saksnummer: '123' }),
}));
vi.mock('hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov', () => ({
  useLøsAvklaringsbehov: () => ({
    løsAvklaringsbehov: vi.fn(),
    løsAvklaringsbehovIsLoading: false,
    løsAvklaringsbehovStatus: undefined,
    løsAvklaringsbehovError: undefined,
  }),
}));
vi.mock('hooks/saksbehandling/visning/VisningHook', () => ({
  useVilkårskortVisning: () => ({ visningActions: [], visningModus: 'AKTIV_MED_AVBRYT' }),
}));

const grunnlag: ForeslåVedtakGrunnlag = {
  perioder: [],
  stansOpphør: [],
  harTilgangTilÅSaksbehandle: true,
};

const endretRettighetsperiode = {
  fra: { fom: '2025-01-01', tom: '2025-12-31' },
  til: { fom: '2025-01-01', tom: '2025-06-30' },
};

const renderMedFlagg = (på: boolean, g: ForeslåVedtakGrunnlag = grunnlag) =>
  customRender(
    <FeatureFlagProvider flags={{ ...mockedFlags, VedtaksperiodeBeslutter: på }}>
      <ForeslåVedtak behandlingVersjon={1} readOnly={false} grunnlag={g} />
    </FeatureFlagProvider>
  );

describe('ForeslåVedtak toggle', () => {
  it('viser ny tittel når toggelen er på', () => {
    renderMedFlagg(true);
    expect(screen.getByText('Behandlingen medfører følgende rettighetsperiode')).toBeVisible();
    expect(screen.queryByText('Vedtaket medfører følgende konsekvens for brukeren:')).not.toBeInTheDocument();
  });

  it('viser gammel visning når toggelen er av', () => {
    renderMedFlagg(false);
    expect(screen.getByText('Foreslå vedtak')).toBeVisible();
    expect(screen.getByText('Vedtaket medfører følgende konsekvens for brukeren:')).toBeVisible();
  });

  it('viser endret rettighetsperiode når toggelen er på', () => {
    renderMedFlagg(true, {
      ...grunnlag,
      endretRettighetsperiode,
    });
    expect(screen.getByText(/Rettighetsperioden er endret/)).toBeVisible();
    const alert = screen.getByText(/Rettighetsperioden er endret/);
    expect(alert).toBeVisible();
    expect(alert).toHaveTextContent(formatDatoMedMånedsnavn('2025-12-31'));
    expect(alert).toHaveTextContent(formatDatoMedMånedsnavn('2025-06-30'));
  });

  it('viser gammel rettighetsperiode som gjennomstreket', () => {
    renderMedFlagg(true, { ...grunnlag, endretRettighetsperiode });
    expect(
      screen.getByText(`${formatDatoMedMånedsnavn('2025-01-01')} – ${formatDatoMedMånedsnavn('2025-12-31')}`).tagName
    ).toBe('S');
  });

  it('viser ikke alert når endretRettighetsperiode er null', () => {
    renderMedFlagg(true);
    expect(screen.queryByText(/Rettighetsperioden er endret/)).not.toBeInTheDocument();
  });

  it('viser ikke alert når toggelen er av', () => {
    renderMedFlagg(false, { ...grunnlag, endretRettighetsperiode });
    expect(screen.queryByText(/Rettighetsperioden er endret/)).not.toBeInTheDocument();
  });
});

describe('ForeslåVedtak tabellrader', () => {
  const medRader: ForeslåVedtakGrunnlag = {
    ...grunnlag,
    perioder: [
      {
        periode: { fom: '2024-06-12', tom: '2025-05-12' },
        utfall: 'OPPFYLT',
        rettighetsType: 'BISTANDSBEHOV',
        avslagsårsak: { underveisavslag: null, vilkårsavslag: [] },
        erNy: true,
        tidligerePerioder: [],
        tidligereVarÅpen: false,
      },
    ],
    stansOpphør: [
      {
        stansOpphørFraOgMed: '2026-01-01',
        historikk: [
          {
            behandlingReferanse: '2a1d2f0e-1b0c-4a52-a7f0-8d1b6e7c1c11',
            erNy: false,
            hjemler: ['§ 11-7'],
            type: 'STANS',
            årsaker: ['BRUDD_PÅ_AKTIVITETSPLIKT_STANS'],
          },
        ],
      },
    ],
  };

  it('viser rad for periode og rad for stans utenfor periodene når toggelen er på', () => {
    renderMedFlagg(true, medRader);
    expect(screen.getByText('AAP innvilget')).toBeVisible();
    expect(screen.getByText('Ny')).toBeVisible();
    expect(screen.getByText('Stans')).toBeVisible();
    expect(screen.getByText('§ 11-7')).toBeVisible();
  });

  it('viser ikke ny tabell når toggelen er av', () => {
    renderMedFlagg(false, medRader);
    expect(screen.queryByText('Ny')).not.toBeInTheDocument();
    expect(screen.queryByText('Endret')).not.toBeInTheDocument();
  });
});
