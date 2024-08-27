import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UføreVisning } from 'components/behandlinger/grunnlag/visberegning/visning/uførevisning/UføreVisning';
import { UføreGrunnlag } from 'lib/types/types';

const grunnlag: UføreGrunnlag = {
  gjennomsnittligInntektSiste3år: 50000,
  gjennomsnittligInntektSiste3årUfør: 50000,
  grunnlag: 6,
  inntektSisteÅr: {
    år: '2023',
    inntektIG: 6,
    inntektIKroner: 600000,
    justertTilMaks6G: 600000,
  },
  inntektSisteÅrUfør: {
    år: '2022',
    inntektIG: 5,
    inntektIKroner: 500000,
    justertTilMaks6G: 500000,
    uføreGrad: 50,
    justertForUføreGrad: 250000,
  },
  inntekter: [
    {
      år: '2022',
      inntektIG: 5,
      inntektIKroner: 50000,
      justertTilMaks6G: 50000,
    },
  ],
  uføreInntekter: [
    {
      år: '2021',
      uføreGrad: 50,
      justertForUføreGrad: 250000,
      inntektIG: 500000,
      justertTilMaks6G: 50000,
      inntektIKroner: 5000,
    },
  ],
};

describe('UføreVisning', () => {
  it('rad for inntekt siste år viser årstall', () => {
    render(<UføreVisning grunnlag={grunnlag} />);
    expect(screen.getByRole('cell', { name: `Inntekt siste år (${grunnlag.inntektSisteÅr.år})` })).toBeVisible();
  });
});
