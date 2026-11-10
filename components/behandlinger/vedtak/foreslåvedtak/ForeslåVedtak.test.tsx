import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';
import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { customRender } from 'lib/test/CustomRender';
import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak';
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

  it('viser ikke alert når endretRettighetsperiode er null', () => {
    renderMedFlagg(true);
    expect(screen.queryByText(/Rettighetsperioden er endret/)).not.toBeInTheDocument();
  });

  it('viser ikke alert når toggelen er av', () => {
    renderMedFlagg(false, { ...grunnlag, endretRettighetsperiode });
    expect(screen.queryByText(/Rettighetsperioden er endret/)).not.toBeInTheDocument();
  });
});
