import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grunnlag1119Visning } from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119Visning';
import { Grunnlag1119 } from 'lib/types/types';

const grunnlag: Grunnlag1119 = {
  gjennomsnittligInntektSiste3år: 6,
  grunnlag: 6,
  inntektSisteÅr: { inntektIG: 0, inntektIKroner: 0, justertTilMaks6G: 0, år: '' },
  inntekter: [{ inntektIG: 0, inntektIKroner: 0, justertTilMaks6G: 0, år: '2010' }],
};

describe('grunnlag 11-19 visning', () => {
  it('skal ha en tabell med pensjonsgivende inntekt for de siste 3 årene', () => {
    render(<Grunnlag1119Visning grunnlag={grunnlag} />);
    const tabellOverskrift = screen.getByText(
      'Standard grunnlagsberegning basert på pensjonsgivende inntekt siste 3 år før redusert arbeidsevne'
    );
    expect(tabellOverskrift).toBeVisible();

    const headers = ['Periode', 'Pensjonsgivende inntekt', 'Inntekt i G', 'Justert til maks 6G'];
    headers.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: new RegExp(`^${header}$`) })).toBeVisible();
    });
  });

  it('skal ha en tabell som viser en oppsummering og det faktiske grunnlaget', () => {
    render(<Grunnlag1119Visning grunnlag={grunnlag} />);
    const tabellOverskrift = screen.getByText(/faktisk grunnlag er satt til høyeste verdi av følgende/i);
    expect(tabellOverskrift).toBeVisible();

    const headers = ['Beskrivelse', 'Grunnlag'];
    headers.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: new RegExp(`^${header}$`) })).toBeVisible();
    });
  });
});
