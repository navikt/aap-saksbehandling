import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { ForeslåVedtakTabell } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/ForeslåVedtakTabell';
import { customRender } from 'lib/test/CustomRender';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';

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

describe('Ny og Endret per rad', () => {
  const oppfylt2 = {
    ...oppfyltPeriode,
    periode: { fom: '2025-07-01', tom: '2025-12-31' },
  };

  it('viser Endret bare på raden som har tidligere periode', () => {
    medGrunnlag({
      perioder: [
        { ...oppfyltPeriode, tidligerePerioder: [] },
        { ...oppfylt2, tidligerePerioder: tidligere },
      ],
    });

    expect(screen.getAllByText('Endret')).toHaveLength(1);
    expect(screen.queryByText('Ny')).not.toBeInTheDocument();

    const rader = screen.getAllByRole('row').slice(1);
    expect(within(rader[0]).queryByText('Endret')).not.toBeInTheDocument();
    expect(within(rader[1]).getByText('Endret')).toBeVisible();
  });

  it('viser Ny på én rad og Endret på en annen', () => {
    medGrunnlag({
      perioder: [
        { ...oppfyltPeriode, erNy: true },
        { ...oppfylt2, tidligerePerioder: tidligere },
      ],
    });

    const rader = screen.getAllByRole('row').slice(1);
    expect(within(rader[0]).getByText('Ny')).toBeVisible();
    expect(within(rader[1]).getByText('Endret')).toBeVisible();
  });

  it('viser ingen tagger når ingen rader har tidligere periode eller er nye', () => {
    medGrunnlag({ perioder: [oppfyltPeriode, oppfylt2] });

    expect(screen.queryByText('Ny')).not.toBeInTheDocument();
    expect(screen.queryByText('Endret')).not.toBeInTheDocument();
  });

  it('bruker periodens erNy og ikke stansens erNy for avslag', () => {
    medGrunnlag({
      perioder: [{ ...ikkeOppfyltPeriode, erNy: false, tidligerePerioder: tidligere }],
      stansOpphør: [{ stansOpphørFraOgMed: '2025-05-13', historikk: [stansVurdering({ erNy: true })] }],
    });

    expect(screen.getByText('Endret')).toBeVisible();
    expect(screen.queryByText('Ny')).not.toBeInTheDocument();
  });
});

const dato = formatDatoMedMånedsnavn;
const førsteRad = () => screen.getAllByRole('row')[1];

describe('Datovisning ved endret periode', () => {
  it('kun fom endret: gammel fom vises og ny fom er uthevet, tom er uendret', () => {
    medGrunnlag({
      perioder: [{ ...oppfyltPeriode, tidligerePerioder: [{ fom: '2024-05-01', tom: '2025-05-12' }] }],
    });

    const rad = within(førsteRad());
    expect(rad.getByText(dato('2024-05-01'))).toBeVisible();
    expect(rad.getByText(dato('2024-06-12')).className).toMatch(/endretDato/);
    expect(rad.getByText(dato('2025-05-12')).className).not.toMatch(/endretDato/);
  });

  it('kun tom endret: gammel tom vises og ny tom er uthevet, fom er uendret', () => {
    medGrunnlag({
      perioder: [{ ...oppfyltPeriode, tidligerePerioder: [{ fom: '2024-06-12', tom: '2025-12-31' }] }],
    });

    const rad = within(førsteRad());
    expect(rad.getByText(dato('2025-12-31'))).toBeVisible();
    expect(rad.getByText(dato('2025-05-12')).className).toMatch(/endretDato/);
    expect(rad.getByText(dato('2024-06-12')).className).not.toMatch(/endretDato/);
  });

  it('både fom og tom endret: gammel periode vises på egen linje og ingen dato er uthevet', () => {
    medGrunnlag({
      perioder: [{ ...oppfyltPeriode, tidligerePerioder: [{ fom: '2024-01-01', tom: '2025-12-31' }] }],
    });

    const rad = within(førsteRad());
    expect(rad.getByText(`${dato('2024-01-01')} – ${dato('2025-12-31')}`).tagName).toBe('DEL');
    expect(rad.getByText(dato('2024-06-12')).className).not.toMatch(/endretDato/);
    expect(rad.getByText(dato('2025-05-12')).className).not.toMatch(/endretDato/);
  });

  it('uendret periode viser ingen gamle datoer', () => {
    medGrunnlag({ perioder: [oppfyltPeriode] });

    const rad = within(førsteRad());
    expect(rad.queryByText(/Endret/)).not.toBeInTheDocument();
    expect(rad.getAllByText(/2024|2025/)).toHaveLength(2);
  });
});

describe('tidligereVarÅpen', () => {
  const åpenFør = { fom: '2025-05-13', tom: '9999-12-31' };
  const avslagMedÅpenFør = (tidligereVarÅpen: boolean) =>
    medGrunnlag({
      perioder: [oppfyltPeriode, { ...ikkeOppfyltPeriode, tidligerePerioder: [åpenFør], tidligereVarÅpen }],
    });

  it('viser ikke gammel tom når forrige avslag var åpent', () => {
    avslagMedÅpenFør(true);
    expect(screen.queryByText(dato('9999-12-31'))).not.toBeInTheDocument();
  });

  it('viser gammel tom når forrige avslag ikke var åpent', () => {
    avslagMedÅpenFør(false);
    expect(screen.getByText(dato('9999-12-31'))).toBeVisible();
  });
});

describe('Skjermleserstøtte for endrede datoer', () => {
  it('kun fom endret: har skjult tekst for tidligere og ny fra', () => {
    medGrunnlag({
      perioder: [{ ...oppfyltPeriode, tidligerePerioder: [{ fom: '2024-05-01', tom: '2025-05-12' }] }],
    });

    const rad = within(førsteRad());
    expect(rad.getByText(/Tidligere fra/)).toBeInTheDocument();
    expect(rad.getByText(/Ny fra/)).toBeInTheDocument();
    expect(rad.queryByText(/Tidligere til/)).not.toBeInTheDocument();
    expect(rad.getByText(dato('2024-05-01')).tagName).toBe('DEL');
  });

  it('kun tom endret: har skjult tekst for tidligere og ny til', () => {
    medGrunnlag({
      perioder: [{ ...oppfyltPeriode, tidligerePerioder: [{ fom: '2024-06-12', tom: '2025-12-31' }] }],
    });

    const rad = within(førsteRad());
    expect(rad.getByText(/Tidligere til/)).toBeInTheDocument();
    expect(rad.getByText(/Ny til/)).toBeInTheDocument();
    expect(rad.queryByText(/Tidligere fra/)).not.toBeInTheDocument();
    expect(rad.getByText(dato('2025-12-31')).tagName).toBe('DEL');
  });

  it('både fom og tom endret: har skjult tekst for tidligere periode', () => {
    medGrunnlag({
      perioder: [{ ...oppfyltPeriode, tidligerePerioder: [{ fom: '2024-01-01', tom: '2025-12-31' }] }],
    });

    const rad = within(førsteRad());
    expect(rad.getByText(/Tidligere periode/)).toBeInTheDocument();
    expect(rad.queryByText(/Tidligere fra|Tidligere til|Ny fra|Ny til/)).not.toBeInTheDocument();
  });

  it('uendret periode har ingen skjult tekst om tidligere datoer', () => {
    medGrunnlag({ perioder: [oppfyltPeriode] });

    expect(screen.queryByText(/Tidligere|Ny fra|Ny til/)).not.toBeInTheDocument();
  });
});
