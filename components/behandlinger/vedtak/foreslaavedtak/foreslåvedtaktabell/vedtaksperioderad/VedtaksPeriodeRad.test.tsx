import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { customRender } from 'lib/test/CustomRender';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { VedtaksPeriodeRad } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/vedtaksperioderad/VedtaksPeriodeRad';
import {
  Periode,
  StansOpphør,
  StansOpphørVurdering,
} from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/foreslaaVedtakRadTekster';

const dato = formatDatoMedMånedsnavn;

const oppfyltPeriode: Periode = {
  periode: { fom: '2024-06-12', tom: '2025-05-12' },
  utfall: 'OPPFYLT',
  rettighetsType: 'BISTANDSBEHOV',
  avslagsårsak: { underveisavslag: null, vilkårsavslag: [] },
  erNy: false,
  tidligerePerioder: [],
  tidligereVarÅpen: false,
};

const ikkeOppfyltPeriode: Periode = { ...oppfyltPeriode, utfall: 'IKKE_OPPFYLT' };

const stansVurdering = (overstyr: Partial<StansOpphørVurdering> = {}): StansOpphørVurdering => ({
  behandlingReferanse: '2a1d2f0e-1b0c-4a52-a7f0-8d1b6e7c1c11',
  erNy: true,
  hjemler: ['§ 11-7'],
  type: 'STANS',
  årsaker: ['BRUDD_PÅ_AKTIVITETSPLIKT_STANS'],
  ...overstyr,
});

const stansOpphørVed = (fraOgMed: string, vurdering: StansOpphørVurdering): StansOpphør => ({
  stansOpphørFraOgMed: fraOgMed,
  historikk: [vurdering],
});

const renderRad = (
  periode: Partial<Periode> = {},
  props: { stansOpphør?: StansOpphør[]; erAvslagUtenViderePerioder?: boolean } = {}
) =>
  customRender(
    <table>
      <tbody>
        <VedtaksPeriodeRad
          vedtaksPeriode={{ ...oppfyltPeriode, ...periode }}
          stansOpphør={props.stansOpphør ?? []}
          erAvslagUtenViderePerioder={props.erAvslagUtenViderePerioder ?? false}
          kunNyTagger={false}
        />
      </tbody>
    </table>
  );

describe('VedtaksPeriodeRad', () => {
  describe('status og type', () => {
    it('viser innvilget AAP med rettighetstype og uten årsak', () => {
      renderRad();

      expect(screen.getByText('AAP innvilget')).toBeVisible();
      expect(screen.getByText('§ 11-6')).toBeVisible();
      expect(screen.getByText('-')).toBeVisible();
    });

    it('viser ikke rett til AAP for avslått periode', () => {
      renderRad(ikkeOppfyltPeriode);

      expect(screen.getByText('Ikke rett til AAP')).toBeVisible();
    });

    it('viser Stans og hjemmel når avslått periode har stans', () => {
      renderRad(ikkeOppfyltPeriode, { stansOpphør: [stansOpphørVed('2024-07-01', stansVurdering())] });

      expect(screen.getByText('Stans')).toBeVisible();
      expect(screen.getByText('§ 11-7')).toBeVisible();
      expect(screen.queryByText('Ikke rett til AAP')).not.toBeInTheDocument();
    });

    it('viser Opphør og hjemmel', () => {
      renderRad(ikkeOppfyltPeriode, {
        stansOpphør: [
          stansOpphørVed(
            '2024-07-01',
            stansVurdering({ type: 'OPPHØR', hjemler: ['§ 11-3'], årsaker: ['BRUDD_PÅ_OPPHOLDSKRAV_OPPHØR'] })
          ),
        ],
      });

      expect(screen.getByText('Opphør')).toBeVisible();
      expect(screen.getByText('§ 11-3')).toBeVisible();
    });

    it('ignorerer stans utenfor perioden', () => {
      renderRad(ikkeOppfyltPeriode, { stansOpphør: [stansOpphørVed('2030-01-01', stansVurdering())] });

      expect(screen.getByText('Ikke rett til AAP')).toBeVisible();
      expect(screen.queryByText('Stans')).not.toBeInTheDocument();
    });
  });

  describe('Ny og Endret', () => {
    const tidligerePerioder = [{ fom: '2024-06-12', tom: '2025-03-12' }];

    it('viser Ny på ny periode', () => {
      renderRad({ erNy: true });

      expect(screen.getByText('Ny')).toBeVisible();
      expect(screen.queryByText('Endret')).not.toBeInTheDocument();
    });

    it('viser Endret når perioden har tidligere perioder og ikke er ny', () => {
      renderRad({ tidligerePerioder });

      expect(screen.getByText('Endret')).toBeVisible();
      expect(screen.queryByText('Ny')).not.toBeInTheDocument();
    });

    it('viser Ny fremfor Endret når perioden er begge', () => {
      renderRad({ erNy: true, tidligerePerioder });

      expect(screen.getByText('Ny')).toBeVisible();
      expect(screen.queryByText('Endret')).not.toBeInTheDocument();
    });

    it('viser verken Ny eller Endret på uendret periode', () => {
      renderRad();

      expect(screen.queryByText('Ny')).not.toBeInTheDocument();
      expect(screen.queryByText('Endret')).not.toBeInTheDocument();
    });

    it('bruker periodens erNy og ikke stansens erNy', () => {
      renderRad(
        { ...ikkeOppfyltPeriode, tidligerePerioder },
        { stansOpphør: [stansOpphørVed('2024-07-01', stansVurdering({ erNy: true }))] }
      );

      expect(screen.getByText('Endret')).toBeVisible();
      expect(screen.queryByText('Ny')).not.toBeInTheDocument();
    });
  });

  describe('radfarge', () => {
    const rad = () => screen.getByRole('row');

    it.each([
      ['ny periode', { erNy: true }, /ny/],
      ['endret periode', { tidligerePerioder: [{ fom: '2024-06-12', tom: '2025-03-12' }] }, /endret/],
    ])('%s får tilhørende klasse', (_, periode, klasse) => {
      renderRad(periode);

      expect(rad().className).toMatch(klasse);
    });

    it('ny periode med stans får stansOpphørNy', () => {
      renderRad(
        { ...ikkeOppfyltPeriode, erNy: true },
        { stansOpphør: [stansOpphørVed('2024-07-01', stansVurdering())] }
      );

      expect(rad().className).toMatch(/stansOpphørNy/);
    });

    it('eksisterende periode med stans får stansOpphør', () => {
      renderRad(ikkeOppfyltPeriode, { stansOpphør: [stansOpphørVed('2024-07-01', stansVurdering())] });

      expect(rad().className).toMatch(/stansOpphør/);
      expect(rad().className).not.toMatch(/stansOpphørNy/);
    });

    it('uendret innvilget periode har ingen fargeklasse', () => {
      renderRad();

      expect(rad().className).not.toMatch(/ny|endret|stansOpphør/);
    });
  });

  describe('datovisning', () => {
    it('kun fom endret: gammel fom er gjennomstreket og ny fom er uthevet', () => {
      renderRad({ tidligerePerioder: [{ fom: '2024-05-01', tom: '2025-05-12' }] });

      expect(screen.getByText(dato('2024-05-01')).tagName).toBe('DEL');
      expect(screen.getByText(dato('2024-06-12')).className).toMatch(/endretDato/);
      expect(screen.getByText(dato('2025-05-12')).className).not.toMatch(/endretDato/);
    });

    it('kun tom endret: gammel tom er gjennomstreket og ny tom er uthevet', () => {
      renderRad({ tidligerePerioder: [{ fom: '2024-06-12', tom: '2025-12-31' }] });

      expect(screen.getByText(dato('2025-12-31')).tagName).toBe('DEL');
      expect(screen.getByText(dato('2025-05-12')).className).toMatch(/endretDato/);
      expect(screen.getByText(dato('2024-06-12')).className).not.toMatch(/endretDato/);
    });

    it('både fom og tom endret: gammel periode på egen linje og ingen dato er uthevet', () => {
      renderRad({ tidligerePerioder: [{ fom: '2024-01-01', tom: '2025-12-31' }] });

      expect(screen.getByText(`${dato('2024-01-01')} – ${dato('2025-12-31')}`).tagName).toBe('DEL');
      expect(screen.getByText(dato('2024-06-12')).className).not.toMatch(/endretDato/);
      expect(screen.getByText(dato('2025-05-12')).className).not.toMatch(/endretDato/);
    });

    it('uendret periode viser kun fom og tom', () => {
      renderRad();

      expect(screen.getAllByText(/2024|2025/)).toHaveLength(2);
    });

    it('skjuler gammel tom når tidligere periode var åpen', () => {
      renderRad({
        tidligerePerioder: [{ fom: '2024-06-12', tom: '9999-12-31' }],
        tidligereVarÅpen: true,
      });

      expect(screen.queryByText(dato('9999-12-31'))).not.toBeInTheDocument();
    });

    it('viser gammel tom når tidligere periode ikke var åpen', () => {
      renderRad({
        tidligerePerioder: [{ fom: '2024-06-12', tom: '9999-12-31' }],
        tidligereVarÅpen: false,
      });

      expect(screen.getByText(dato('9999-12-31')).tagName).toBe('DEL');
    });

    it('skjuler tom for avslag uten videre perioder', () => {
      renderRad(ikkeOppfyltPeriode, { erAvslagUtenViderePerioder: true });

      expect(screen.queryByText(dato('2025-05-12'))).not.toBeInTheDocument();
      expect(screen.getByText(dato('2024-06-12'))).toBeVisible();
    });
  });
});
