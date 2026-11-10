import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { ForeslåVedtakTabell } from 'components/behandlinger/vedtak/foreslåvedtak/foreslåvedtaktabell/ForeslåVedtakTabell';
import { customRender } from 'lib/test/CustomRender';

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
      erNy: false,
      tidligerePerioder: [],
      tidligereVarÅpen: false,
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
        vilkårsavslag: [],
      },
      erNy: false,
      tidligerePerioder: [],
      tidligereVarÅpen: false,
    },
  ],
  stansOpphør: [],
  harTilgangTilÅSaksbehandle: true,
};

describe('Foreslå vedtak', () => {
  it('Skal vise tabellrader for perioder med innvilget og avslått AAP', () => {
    customRender(<ForeslåVedtakTabell grunnlag={foreslåVedtakGrunnlag} />);
    const innvilget = screen.getByText('AAP innvilget');
    expect(innvilget).toBeVisible();

    const avslått = screen.getByText('Ikke rett til AAP');
    expect(avslått).toBeVisible();
  });

  it('Skal vise avslått AAP om ingen perioder i grunnlag', () => {
    customRender(
      <ForeslåVedtakTabell
        grunnlag={{
          perioder: [],
          stansOpphør: [],
          harTilgangTilÅSaksbehandle: true,
        }}
      />
    );
    const avslåttPeriode = screen.getByText('Ikke rett til AAP');
    expect(avslåttPeriode).toBeVisible();
  });

  it('Skal vise rettighetstype på innvilget AAP', () => {
    customRender(<ForeslåVedtakTabell grunnlag={foreslåVedtakGrunnlag} />);
    const innvilgetÅrsak = screen.getByText('§ 11-6');
    expect(innvilgetÅrsak).toBeVisible();
  });
});

type StansOpphørVurdering = ForeslåVedtakGrunnlag['stansOpphør'][number]['historikk'][number];

const oppfyltPeriode = foreslåVedtakGrunnlag.perioder[0];
const ikkeOppfyltPeriode = foreslåVedtakGrunnlag.perioder[1];
const tidligere = [{ fom: '2024-06-12', tom: '2025-03-12' }];
const stansVurdering = (overstyr: Partial<StansOpphørVurdering> = {}): StansOpphørVurdering => ({
  behandlingReferanse: '2a1d2f0e-1b0c-4a52-a7f0-8d1b6e7c1c11',
  erNy: true,
  hjemler: ['§ 11-7'],
  type: 'STANS',
  årsaker: ['BRUDD_PÅ_AKTIVITETSPLIKT_STANS'],
  ...overstyr,
});

const medGrunnlag = (grunnlag: Partial<ForeslåVedtakGrunnlag>) =>
  customRender(<ForeslåVedtakTabell grunnlag={{ ...foreslåVedtakGrunnlag, ...grunnlag }} />);

describe('Ny og Endret', () => {
  it('viser Ny på ny innvilget periode', () => {
    medGrunnlag({ perioder: [{ ...oppfyltPeriode, erNy: true }] });
    expect(screen.getByText('Ny')).toBeVisible();
    expect(screen.queryByText('Endret')).not.toBeInTheDocument();
  });

  it('viser Endret når perioden har tidligere perioder og ikke er ny', () => {
    medGrunnlag({ perioder: [{ ...oppfyltPeriode, erNy: false, tidligerePerioder: tidligere }] });
    expect(screen.getByText('Endret')).toBeVisible();
    expect(screen.queryByText('Ny')).not.toBeInTheDocument();
  });

  it('viser Ny fremfor Endret når perioden er begge', () => {
    medGrunnlag({ perioder: [{ ...oppfyltPeriode, erNy: true, tidligerePerioder: tidligere }] });
    expect(screen.getByText('Ny')).toBeVisible();
    expect(screen.queryByText('Endret')).not.toBeInTheDocument();
  });

  it('viser verken Ny eller Endret på uendret periode', () => {
    medGrunnlag({});
    expect(screen.queryByText('Ny')).not.toBeInTheDocument();
    expect(screen.queryByText('Endret')).not.toBeInTheDocument();
  });
});

describe('Stans og opphør', () => {
  it('viser Stans, hjemmel og Ny i avslått periode', () => {
    medGrunnlag({
      perioder: [{ ...ikkeOppfyltPeriode, erNy: true }],
      stansOpphør: [{ stansOpphørFraOgMed: '2025-05-13', historikk: [stansVurdering()] }],
    });
    expect(screen.getByText('Stans')).toBeVisible();
    expect(screen.getByText('Ny')).toBeVisible();
    expect(screen.getByText('§ 11-7')).toBeVisible();
    expect(screen.queryByText('Ikke rett til AAP')).not.toBeInTheDocument();
  });

  it('viser Opphør med hjemmel', () => {
    medGrunnlag({
      perioder: [ikkeOppfyltPeriode],
      stansOpphør: [
        {
          stansOpphørFraOgMed: '2025-05-13',
          historikk: [
            stansVurdering({ type: 'OPPHØR', hjemler: ['§ 11-3'], årsaker: ['BRUDD_PÅ_OPPHOLDSKRAV_OPPHØR'] }),
          ],
        },
      ],
    });
    expect(screen.getByText('Opphør')).toBeVisible();
    expect(screen.getByText('§ 11-3')).toBeVisible();
  });

  it('viser ikke Ny når stansen ikke er ny', () => {
    medGrunnlag({
      perioder: [ikkeOppfyltPeriode],
      stansOpphør: [{ stansOpphørFraOgMed: '2025-05-13', historikk: [stansVurdering({ erNy: false })] }],
    });
    expect(screen.getByText('Stans')).toBeVisible();
    expect(screen.queryByText('Ny')).not.toBeInTheDocument();
  });

  it('viser egen rad for stans utenfor alle perioder', () => {
    medGrunnlag({
      perioder: [oppfyltPeriode],
      stansOpphør: [{ stansOpphørFraOgMed: '2026-01-01', historikk: [stansVurdering()] }],
    });
    expect(screen.getByText('AAP innvilget')).toBeVisible();
    expect(screen.getByText('Stans')).toBeVisible();
    expect(screen.getByText('Ny')).toBeVisible();
  });

  it('viser ikke rad for opphevet stans utenfor alle perioder', () => {
    medGrunnlag({
      perioder: [oppfyltPeriode],
      stansOpphør: [
        { stansOpphørFraOgMed: '2026-01-01', historikk: [stansVurdering({ type: 'OPPHEVET', årsaker: [] })] },
      ],
    });
    expect(screen.queryByText('Stans')).not.toBeInTheDocument();
    expect(screen.queryByText('Opphør')).not.toBeInTheDocument();
  });

  it('viser ikke "Ikke rett til AAP" når det kun finnes stans uten periode', () => {
    medGrunnlag({
      perioder: [],
      stansOpphør: [{ stansOpphørFraOgMed: '2026-01-01', historikk: [stansVurdering()] }],
    });
    expect(screen.getByText('Stans')).toBeVisible();
    expect(screen.queryByText('Ikke rett til AAP')).not.toBeInTheDocument();
  });
});
