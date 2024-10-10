import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YrkesskadeVisning } from 'components/behandlinger/grunnlag/visberegning/visning/yrkesskadevisning/YrkesskadeVisning';
import { YrkesskadeGrunnlag } from 'lib/types/types';

const grunnlag: YrkesskadeGrunnlag = {
  gjennomsnittligInntektSiste3år: 0,
  grunnlag: 0,
  inntektSisteÅr: { inntektIG: 0, inntektIKroner: 0, justertTilMaks6G: 0, år: '2023' },
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
    const tabellOverskrift = screen.getByText('Grunnlagsberegning § 11-19');
    expect(tabellOverskrift).toBeVisible();
  });

  it('skal ha en tabell med grunnlagsberegning for 11-19 med yrkesskadefordel', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} />);
    const tabellOverskrift = screen.getByText(
      'Grunnlagsberegning § 11-19, jf. grunnlag ved yrkesskadefordel etter § 11-22'
    );
    expect(tabellOverskrift).toBeVisible();
  });

  it('skal ha en tabell som viser en oppsummering og det faktiske grunnlaget', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} />);
    const tabellOverskrift = screen.getByText('Innbyggers grunnlag er satt til det gunstigste av følgende:');
    expect(tabellOverskrift).toBeVisible();
  });

  it('viser detaljer for beregningen', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} />);
    expect(
      screen.getByRole('button', { name: 'Se detaljer om beregningen for innbygger med yrkesskade' })
    ).toBeVisible();
    expect(screen.getByText(/^Der yrkesskade er medvirkende årsak til redusert/));
  });

  it('rad med inntekt siste år viser årstall', () => {
    render(<YrkesskadeVisning grunnlag={grunnlag} />);
    expect(
      screen.getByRole('cell', { name: `§ 11-19 Inntekt siste år (${grunnlag.inntektSisteÅr.år})` })
    ).toBeVisible();
  });
});
