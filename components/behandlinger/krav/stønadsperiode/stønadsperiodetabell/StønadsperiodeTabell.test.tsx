import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { StønadsperiodeGrunnlag, StønadsperiodeVurdering } from 'lib/types/types';
import { StønadsperiodeTabell } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodetabell/StønadsperiodeTabell';

function vurdering(overrides: Partial<StønadsperiodeVurdering> = {}): StønadsperiodeVurdering {
  return {
    begrunnelse: 'Begrunnelse',
    harGjenværendeKvote: true,
    harHattOrdinærSiste52Uker: true,
    opprettet: '2025-04-01T10:30:00Z',
    referanse: 'ref-1',
    relevantKravType: { type: 'NY_STØNADSPERIODE' },
    startDato: '2025-04-15',
    vurdertAv: 'Z000000',
    vurdertIBehandling: { id: 1 },
    ...overrides,
  };
}

describe('StønadsperiodeTabell', () => {
  it('viser kun gjeldende vurderinger, ikke nye eller vedtatte som er overstyrt', () => {
    const grunnlag: StønadsperiodeGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      gjeldendeVurderinger: [vurdering({ referanse: 'gjeldende', startDato: '2025-04-15' })],
      nyeVurderinger: [vurdering({ referanse: 'ny', startDato: '2025-06-01' })],
      vedtatteVurderinger: [vurdering({ referanse: 'vedtatt', startDato: '2024-01-01' })],
    };

    render(<StønadsperiodeTabell grunnlag={grunnlag} />);

    expect(screen.getByRole('cell', { name: '15.04.2025' })).toBeVisible();
    expect(screen.queryByRole('cell', { name: '01.06.2025' })).not.toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: '01.01.2024' })).not.toBeInTheDocument();
  });

  it('viser én rad per gjeldende vurdering', () => {
    const grunnlag: StønadsperiodeGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      gjeldendeVurderinger: [
        vurdering({ referanse: 'a', startDato: '2025-04-15' }),
        vurdering({ referanse: 'b', startDato: '2025-07-01', relevantKravType: { type: 'AVSLAG' } }),
      ],
      nyeVurderinger: [],
      vedtatteVurderinger: [],
    };

    render(<StønadsperiodeTabell grunnlag={grunnlag} />);

    expect(screen.getByText('Krav om ny stønadsperiode')).toBeVisible();
    expect(screen.getByText('Avslag § 12')).toBeVisible();
  });
});
