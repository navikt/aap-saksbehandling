import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { ForeslåVedtakTabell } from 'components/behandlinger/vedtak/foreslåvedtak/foreslåvedtaktabell/ForeslåVedtakTabell';

const foreslåVedtakGrunnlag: ForeslåVedtakGrunnlag = {
  perioder: [
    {
      periode: {
        fom: '2024-06-12',
        tom: '2025-05-12',
      },
      utfall: 'OPPFYLT',
      rettighetsType: 'BISTANDSBEHOV',
      avslagsårsak: {
        underveisavslag: null,
        vilkårsavslag: [],
      },
    },
    {
      periode: {
        fom: '2025-05-13',
        tom: '2025-06-12',
      },
      utfall: 'IKKE_OPPFYLT',
      rettighetsType: 'BISTANDSBEHOV',
      avslagsårsak: {
        underveisavslag: null,
        vilkårsavslag: ['ANNEN_FULL_YTELSE'],
      },
    },
  ],
};

const foreslåVedtakGrunnlagUgyldigAvslagsårsak: ForeslåVedtakGrunnlag = {
  perioder: [
    {
      periode: {
        fom: '2025-05-13',
        tom: '2025-06-12',
      },
      utfall: 'IKKE_OPPFYLT',
      rettighetsType: 'BISTANDSBEHOV',
      avslagsårsak: {
        underveisavslag: null,
        vilkårsavslag: ['MANGLENDE_DOKUMENTASJON', 'ANNEN_FULL_YTELSE'],
      },
    },
  ],
};

describe('Foreslå vedtak', () => {
  it('Skal vise tabellrader for perioder med innvilget og avslått AAP', () => {
    render(<ForeslåVedtakTabell grunnlag={foreslåVedtakGrunnlag} />);
    const innvilget = screen.getByText('AAP innvilget');
    expect(innvilget).toBeVisible();

    const avslått = screen.getByText('Ikke rett på AAP');
    expect(avslått).toBeVisible();
  });

  it('Skal vise avslått AAP om ingen perioder i grunnlag', () => {
    render(
      <ForeslåVedtakTabell
        grunnlag={{
          perioder: [],
        }}
      />
    );
    const avslåttPeriode = screen.getByText('Ikke rett på AAP');
    expect(avslåttPeriode).toBeVisible();
  });

  it('Skal vise rettighetstype på innvilget AAP', () => {
    render(<ForeslåVedtakTabell grunnlag={foreslåVedtakGrunnlag} />);
    const innvilgetÅrsak = screen.getByText('§ 11-6 Bistandsbehov');
    expect(innvilgetÅrsak).toBeVisible();
  });

  it('Skal vise avslagsårsak når den finnes', () => {
    render(<ForeslåVedtakTabell grunnlag={foreslåVedtakGrunnlag} />);
    const innvilgetÅrsak = screen.getByText('§ 11-6 Bistandsbehov');
    expect(innvilgetÅrsak).toBeVisible();

    const avslagsÅrsak = screen.getByText("Annen full ytelse")
    expect(avslagsÅrsak).toBeVisible()
  });

  it('Skal ikke vise avslagsårsak vi ikke vet om er riktig', () => {
    render(<ForeslåVedtakTabell grunnlag={foreslåVedtakGrunnlagUgyldigAvslagsårsak} />);
    const avslåttPeriode = screen.getByText('Ikke rett på AAP');
    expect(avslåttPeriode).toBeVisible();

    const avslagsÅrsak = screen.getByText("-")
    expect(avslagsÅrsak).toBeVisible()

    const annenFullYtelse = screen.queryByText("Annen full ytelse")
    expect(annenFullYtelse).not.toBeInTheDocument()

  });
});
