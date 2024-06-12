import { render, screen } from '@testing-library/react';
import { Alder } from 'components/behandlinger/alder/Alder';
import { AlderGrunnlag } from 'lib/types/types';

const grunnlagOppfylt: AlderGrunnlag = {
  fødselsdato: '2000-01-02',
  vilkårsperioder: [
    {
      periode: {
        fom: '2024-06-12',
        tom: '2027-06-12',
      },
      utfall: 'OPPFYLT',
      manuellVurdering: false,
    },
  ],
};

const grunnlagIkkeOppfylt: AlderGrunnlag = {
  fødselsdato: '2000-01-02',
  vilkårsperioder: [
    {
      periode: {
        fom: '2024-06-12',
        tom: '2027-06-12',
      },
      utfall: 'IKKE_OPPFYLT',
      manuellVurdering: false,
    },
  ],
};

describe('alder', () => {
  it('Skal vise fødselsdato', () => {
    render(<Alder grunnlag={grunnlagOppfylt} />);
    const fødselsdatoLabel = screen.getByText('Fødselsdato');
    const fødselsdatoValue = screen.getByText('02.01.2000');

    expect(fødselsdatoLabel).toBeVisible();
    expect(fødselsdatoValue).toBeVisible();
  });

  it('skal vise tabell med utfall, fra og med, til og med i header', () => {
    render(<Alder grunnlag={grunnlagOppfylt} />);
    const utfall = screen.getByRole('columnheader', { name: /utfall/i });
    const fraOgMed = screen.getByRole('columnheader', { name: /fra og med/i });
    const tilOgMed = screen.getByRole('columnheader', { name: /til og med/i });

    expect(utfall).toBeVisible();
    expect(fraOgMed).toBeVisible();
    expect(tilOgMed).toBeVisible();
  });

  it('skal vise verdien Oppfylt under utfall med tilhørende perioder dersom vilkåret er oppfylt', () => {
    render(<Alder grunnlag={grunnlagOppfylt} />);
    const utfallValue = screen.getByRole('cell', { name: /oppfylt/i });
    const fraOgMedValue = screen.getByRole('cell', { name: /12\.06\.2024/i });
    const tilOgMedValue = screen.getByRole('cell', { name: /12\.06\.2027/i });

    expect(utfallValue).toBeVisible();
    expect(fraOgMedValue).toBeVisible();
    expect(tilOgMedValue).toBeVisible();
  });

  it('skal vise verdien Ikke oppfylt under utfall med tilhørende perioder dersom vilkåret ikke er oppfylt', () => {
    render(<Alder grunnlag={grunnlagIkkeOppfylt} />);
    const utfallValue = screen.getByRole('cell', { name: /Ikke oppfylt/i });
    const fraOgMedValue = screen.getByRole('cell', { name: /12\.06\.2024/i });
    const tilOgMedValue = screen.getByRole('cell', { name: /12\.06\.2027/i });

    expect(utfallValue).toBeVisible();
    expect(fraOgMedValue).toBeVisible();
    expect(tilOgMedValue).toBeVisible();
  });
});
