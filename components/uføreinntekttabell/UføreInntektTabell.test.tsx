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
    justertForUføreGradiG: 5,
    inntektsPerioder: [
      {
        inntektIKroner: {
          verdi: 750000,
        },
        inntektJustertForUføregrad: {
          verdi: 500000,
        },
        periode: {
          fom: '2024-12-01',
          tom: '2024-12-31',
        },
        uføregrad: {},
      },
    ],
  },
];

describe('tabell for å vise uføre inntekter', () => {
  it('skal ha en overskrift', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} ytterligereNedsattArbeidsevneÅr="2021" />);
    const overskrift = screen.getByText('Grunnlagsberegning § 11-19 etter oppjustering jf. § 11-28 fjerde ledd');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en kolonne som heter Periode', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} ytterligereNedsattArbeidsevneÅr="2021" />);
    const periodeKolonne = screen.getByRole('columnheader', { name: /periode/i });
    expect(periodeKolonne).toBeVisible();
  });

  it('skal ha en kolonne som heter Uføregrad', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} ytterligereNedsattArbeidsevneÅr="2021" />);
    const uføregradKolonne = screen.getByRole('columnheader', { name: /Uføregrad/i });
    expect(uføregradKolonne).toBeVisible();
  });

  it('skal ha en kolonne som heter Pensjonsgivende inntekt', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} ytterligereNedsattArbeidsevneÅr="2021" />);
    const pensjonsgivendeInntektKolonne = screen.getByRole('columnheader', { name: /Pensjonsgivende inntekt/i });
    expect(pensjonsgivendeInntektKolonne).toBeVisible();
  });

  it('skal ha en kolonne som heter Oppjustert 100%', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} ytterligereNedsattArbeidsevneÅr="2021" />);
    const oppjustertHundreProsentKolonne = screen.getByRole('columnheader', { name: /Oppjustert 100%/i });
    expect(oppjustertHundreProsentKolonne).toBeVisible();
  });

  it('skal ha en kolonne som heter Inntektsgrunnlag (maks 6 G)', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} ytterligereNedsattArbeidsevneÅr="2021" />);
    const justertTilMaks6GKolonne = screen.getByRole('columnheader', { name: 'Inntektsgrunnlag (maks 6 G)' });
    expect(justertTilMaks6GKolonne).toBeVisible();
  });

  it('skal ha et felt med gjennomsnittlig inntekt siste 3 år', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} ytterligereNedsattArbeidsevneÅr="2021" />);
    const felt = screen.getByText(`Gjennomsnitt ${innteker.at(0)?.år} - ${innteker.at(-1)?.år}`);
    expect(felt).toBeVisible();
  });

  it('skal rendre en rad', () => {
    render(<UføreInntektTabell inntekter={innteker} gjennomsnittSiste3år={6} ytterligereNedsattArbeidsevneÅr="2021" />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // Inneholder headers
  });
});
