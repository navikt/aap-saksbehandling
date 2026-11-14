import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { customRender } from 'lib/test/CustomRender';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { StansOpphørUtenPeriodeRad } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/StansOpphørUtenPeriodeRad';
import {
  StansOpphør,
  StansOpphørVurdering,
} from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/foreslaaVedtakRadTekster';

const vurdering = (overstyr: Partial<StansOpphørVurdering> = {}): StansOpphørVurdering => ({
  behandlingReferanse: '2a1d2f0e-1b0c-4a52-a7f0-8d1b6e7c1c11',
  erNy: true,
  hjemler: ['§ 11-7'],
  type: 'STANS',
  årsaker: ['BRUDD_PÅ_AKTIVITETSPLIKT_STANS'],
  ...overstyr,
});

const renderRad = (historikk: StansOpphørVurdering[]) => {
  const stansOpphør: StansOpphør = { stansOpphørFraOgMed: '2026-01-01', historikk };
  return customRender(
    <table>
      <tbody>
        <StansOpphørUtenPeriodeRad stansOpphør={stansOpphør} kunNyTagger={true} />
      </tbody>
    </table>
  );
};

describe('StansOpphørUtenPeriodeRad', () => {
  it('viser Stans, fra-dato og hjemmel', () => {
    renderRad([vurdering()]);

    expect(screen.getByText('Stans')).toBeVisible();
    expect(screen.getByText(`${formatDatoMedMånedsnavn('2026-01-01')} -`)).toBeVisible();
    expect(screen.getByText('§ 11-7')).toBeVisible();
  });

  it('viser Opphør', () => {
    renderRad([vurdering({ type: 'OPPHØR', hjemler: ['§ 11-3'], årsaker: ['BRUDD_PÅ_OPPHOLDSKRAV_OPPHØR'] })]);

    expect(screen.getByText('Opphør')).toBeVisible();
    expect(screen.getByText('§ 11-3')).toBeVisible();
  });

  it('viser Ny og rød bakgrunn med markering når stansen er ny', () => {
    renderRad([vurdering({ erNy: true })]);

    expect(screen.getByText('Ny')).toBeVisible();
    expect(screen.getByRole('row').className).toMatch(/stansOpphørNy/);
  });

  it('viser ikke Ny når stansen ikke er ny', () => {
    renderRad([vurdering({ erNy: false })]);

    expect(screen.queryByText('Ny')).not.toBeInTheDocument();
    expect(screen.getByRole('row').className).toMatch(/stansOpphør/);
    expect(screen.getByRole('row').className).not.toMatch(/stansOpphørNy/);
  });
});
