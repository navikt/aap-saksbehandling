import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grunnlag1119Visning } from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119Visning';
import { Grunnlag1119 } from 'lib/types/types';

const grunnlag: Grunnlag1119 = {
  gjennomsnittligInntektSiste3år: 6,
  grunnlag: 6,
  inntektSisteÅr: { inntektIG: 0, inntektIKroner: 0, justertTilMaks6G: 0, år: '2023' },
  inntekter: [{ inntektIG: 0, inntektIKroner: 0, justertTilMaks6G: 0, år: '2010' }],
};

describe('grunnlag 11-19 visning', () => {
  it('skal ha en tabell med pensjonsgivende inntekt for de siste 3 årene', () => {
    render(<Grunnlag1119Visning grunnlag={grunnlag} />);
    const tabellOverskrift = screen.getByText('Grunnlagsberegning § 11-19');
    expect(tabellOverskrift).toBeVisible();

    const headers = ['Periode', 'Pensjonsgivende inntekt', 'Inntektsgrunnlag \\(maks 6 G\\)'];
    headers.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: new RegExp(`^${header}$`) })).toBeVisible();
    });
  });

  it('skal ha en tabell som viser en oppsummering og det faktiske grunnlaget', () => {
    render(<Grunnlag1119Visning grunnlag={grunnlag} />);
    const tabellOverskrift = screen.getByText('Innbyggers grunnlag er satt til det gunstigste av følgende:');
    expect(tabellOverskrift).toBeVisible();

    const headers = ['Beskrivelse', 'Grunnlag'];
    headers.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: new RegExp(`^${header}$`) })).toBeVisible();
    });

    expect(screen.getByRole('rowheader', { name: 'Fastsatt grunnlag' })).toBeVisible();
  });

  it('rad med inntekt siste år viser årstall', () => {
    render(<Grunnlag1119Visning grunnlag={grunnlag} />);
    expect(
      screen.getByRole('cell', { name: `§ 11-19 Inntekt siste år (${grunnlag.inntektSisteÅr.år})` })
    ).toBeVisible();
  });
});
