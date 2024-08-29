import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UføreInntekt } from 'lib/types/types';
import { UføreInntektTabell } from 'components/uføreinntekttabell/UføreInntektTabell';

const innteker: Array<UføreInntekt> = [
  {
    år: '2020',
    justertTilMaks6G: 6,
    inntektIG: 6,
    inntektIKroner: 1000000,
    uføreGrad: 30,
    justertForUføreGrad: 500000,
  },
];

describe('tabell for å vise uføre inntekter', () => {
  it('skal ha en overskrift', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} />);
    const overskrift = screen.getByText('Grunnlagsberegning ytterligere nedsatt arbeidsevne ved ufør');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en kolonne som heter Periode', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} />);
    const periodeKolonne = screen.getByRole('columnheader', { name: /periode/i });
    expect(periodeKolonne).toBeVisible();
  });

  // Fiks denne
  it.skip('skal ha en kolonne som heter Uføregrad', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} />);
    const uføregradKolonne = screen.getByRole('columnheader', { name: /uføregrad/i });
    expect(uføregradKolonne).toBeVisible();
  });

  // Fiks denne
  it.skip('skal ha en kolonne som heter inntekt', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} />);
    const inntektKolonne = screen.getByRole('columnheader', { name: /inntekt/i });
    expect(inntektKolonne).toBeVisible();
  });

  it('skal ha en kolonne som heter Justert for uføregrad', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} />);
    const justertForUføregradKolonne = screen.getByRole('columnheader', { name: /justert for uføregrad/i });
    expect(justertForUføregradKolonne).toBeVisible();
  });

  it('skal ha en kolonne som heter Inntekt i G', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} />);
    const inntektIGKolonne = screen.getByRole('columnheader', { name: /inntekt i g/i });
    expect(inntektIGKolonne).toBeVisible();
  });

  it('skal ha en kolonne som heter Justert til maks 6G', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} />);
    const justertTilMaks6GKolonne = screen.getByRole('columnheader', { name: /justert til maks 6g/i });
    expect(justertTilMaks6GKolonne).toBeVisible();
  });

  it('skal ha et felt med gjennomsnittlig inntekt siste 3 år', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} />);
    const felt = screen.getByText('Gjennomsnitt siste 3 år før ytterligere nedsatt');
    expect(felt).toBeVisible();
  });

  it('skal rendre en rad', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // Inneholder headers og gjennomsnitt siste 3 år
  });
});
