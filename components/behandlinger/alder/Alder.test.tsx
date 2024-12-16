import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alder, kalkulerAlder } from 'components/behandlinger/alder/Alder';
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
      versjon: "1",
    },
  ],
};

const grunnlagIkkeOppfylt: AlderGrunnlag = {
  fødselsdato: '1958-01-02',
  vilkårsperioder: [
    {
      periode: {
        fom: '2024-06-12',
        tom: '2027-06-12',
      },
      utfall: 'IKKE_OPPFYLT',
      manuellVurdering: false,
      avslagsårsak: 'BRUKER_OVER_67',
      versjon: "1",
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

  it('Skal vise alder', () => {
    render(<Alder grunnlag={grunnlagOppfylt} />);
    const alderString = kalkulerAlder(new Date(grunnlagOppfylt.fødselsdato));
    const alder = screen.getByText(`(Bruker er ${alderString} i dag)`);

    expect(alder).toBeVisible();
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

  it('skal vise avslagsårsak dersom vilkårsperioden ikke er oppfylt', () => {
    render(<Alder grunnlag={grunnlagIkkeOppfylt} />);
    const avslagsårsakLabel = screen.getByRole('columnheader', { name: /avslagsårsak/i });
    const avslagsårsaValue = screen.getByRole('cell', { name: 'Brukeren er over 67 år.' });

    expect(avslagsårsakLabel).toBeVisible();
    expect(avslagsårsaValue).toBeVisible();
  });

  it('skal ikke vise avslagsårsak dersom alle vilkårsperioden er oppfylt', async () => {
    render(<Alder grunnlag={grunnlagOppfylt} />);
    const avslagsårsakLabel = await screen.queryByRole('columnheader', { name: /avslagsårsak/i });

    expect(avslagsårsakLabel).not.toBeInTheDocument();
  });

  it('skal vise alderen brukeren blir 67 år', () => {
    render(<Alder grunnlag={grunnlagOppfylt} />);
    const label = screen.getByText('Dato bruker blir 67 år');
    expect(label).toBeInTheDocument();

    const verdi = screen.getByText('02.01.2067');
    expect(verdi).toBeInTheDocument();
  });
});
