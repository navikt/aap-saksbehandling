import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YrkesskadeVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadevisning/YrkesskadeVisning';
import { GjeldendeGrunnbeløp, YrkesskadeGrunnlag } from 'lib/types/types';

const grunnlag: YrkesskadeGrunnlag = {
  gjennomsnittligInntektSiste3år: 0,
  grunnlag: 0,
  inntektSisteÅr: { inntektIG: 0, inntektIKroner: 0, justertTilMaks6G: 0, år: '2023' },
  inntekter: [],
  standardBeregning: { inntektIG: 0, prosentVekting: 0, andelGangerInntektIG: 1, andelGangerInntekt: 1120000 },
  standardYrkesskade: { andelGangerInntekt: 168000, andelGangerInntektIG: 1.89, inntektIG: 1.5, prosentVekting: 50 },
  yrkesskadeTidspunkt: '2023-01-02',
  nedsattArbeidsevneÅr: '2024',
  yrkesskadeGrunnlag: 0,
  yrkesskadeinntekt: {
    antattÅrligInntektIGYrkesskadeTidspunktet: 0,
    antattÅrligInntektIKronerYrkesskadeTidspunktet: 0,
    justertTilMaks6G: 2,
    prosentVekting: 0,
    andelGangerInntekt: 220000,
    andelGangerInntektIG: 2,
  },
};

const gjeldendeGrunnbeløp: GjeldendeGrunnbeløp = {
  dato: '2025-01-02',
  grunnbeløp: 124000,
};

describe('yrkesskade visning', () => {
  it('skal ha en tabell med pensjonsgivende inntekt for de siste 3 årene', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} gjeldendeGrunnbeløp={gjeldendeGrunnbeløp} />);
    const tabellOverskrift = screen.getByText('Grunnlagsberegning § 11-19');
    expect(tabellOverskrift).toBeVisible();
  });

  it('skal ha en tabell med grunnlagsberegning for 11-19 med yrkesskadefordel', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} gjeldendeGrunnbeløp={gjeldendeGrunnbeløp} />);
    const tabellOverskrift = screen.getByText(
      'Grunnlagsberegning § 11-19, jf. grunnlag ved yrkesskadefordel etter § 11-22'
    );
    expect(tabellOverskrift).toBeVisible();
  });

  it('skal ha en tabell som viser en oppsummering og det faktiske grunnlaget', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} gjeldendeGrunnbeløp={gjeldendeGrunnbeløp} />);
    const tabellOverskrift = screen.getByText('Brukers grunnlag er satt til det gunstigste av følgende');
    expect(tabellOverskrift).toBeVisible();
  });

  it('viser detaljer for beregningen', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} gjeldendeGrunnbeløp={gjeldendeGrunnbeløp} />);
    expect(screen.getByRole('button', { name: 'Se detaljer om beregningen for bruker med yrkesskade' })).toBeVisible();
    expect(screen.getByText(/^Der yrkesskade er medvirkende årsak til redusert/));
  });

  it('rad med inntekt siste år viser årstall', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} gjeldendeGrunnbeløp={gjeldendeGrunnbeløp} />);
    expect(
      screen.getByRole('cell', { name: `§ 11-19 Inntekt siste år (${grunnlag.inntektSisteÅr.år})` })
    ).toBeVisible();
  });
});
