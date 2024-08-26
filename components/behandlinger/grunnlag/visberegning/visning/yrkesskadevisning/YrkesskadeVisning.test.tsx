import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YrkesskadeVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadevisning/YrkesskadeVisning';
import { YrkesskadeGrunnlag } from 'lib/types/types';

const grunnlag: YrkesskadeGrunnlag = {
  gjennomsnittligInntektSiste3år: 0,
  grunnlag: 0,
  inntektSisteÅr: { inntektIG: 0, inntektIKroner: 0, justertTilMaks6G: 0, år: '' },
  inntekter: [],
  standardBeregning: { inntektIG: 0, justertTilMaks6G: 0, prosentVekting: 0 },
  yrkesskadeGrunnlag: 0,
  yrkesskadeinntekt: {
    antattÅrligInntektIGYrkesskadeTidspunktet: 0,
    antattÅrligInntektIKronerYrkesskadeTidspunktet: 0,
    justertTilMaks6G: 0,
    prosentVekting: 0,
  },
};

describe('yrkesskade visning', () => {
  it('skal ha en tabell med pensjonsgivende inntekt for de siste 3 årene', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} />);
    const tabellOverskrift = screen.getByText(
      'Standard grunnlagsberegning basert på pensjonsgivende inntekt siste 3 år før redusert arbeidsevne'
    );
    expect(tabellOverskrift).toBeVisible();
  });

  it('skal ha en tabell med pensjonsgivende inntekt for de siste 3 årene', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} />);
    const tabellOverskrift = screen.getByText(/yrkesskade grunnlagsberegning § 11-22/i);
    expect(tabellOverskrift).toBeVisible();
  });

  it('skal ha en tabell som viser en oppsummering og det faktiske grunnlaget', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} />);
    const tabellOverskrift = screen.getByText(/faktisk grunnlag er satt til høyeste verdi av følgende/i);
    expect(tabellOverskrift).toBeVisible();
  });
});
