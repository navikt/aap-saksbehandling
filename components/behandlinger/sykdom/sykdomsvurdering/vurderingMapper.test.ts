import { describe, expect, it } from 'vitest';
import mapTilPeriodisertVurdering from 'components/behandlinger/sykdom/sykdomsvurdering/vurderingMapper';
import { JaEllerNei } from 'lib/utils/form';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { addMonths } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';

const rettighetsperiodeStart = new Date('2024-01-01');
// Samme dato som rettighetsperiodeStart → vurderingDatoSammeSomRettighetsperiodeStart = true
const fraDatoSammeSomRettighetsperiodeStart = formaterDatoForFrontend(rettighetsperiodeStart);
// Dato etter rettighetsperiodeStart → vurderingDatoSammeSomRettighetsperiodeStart = false
const fraDatoEtterRettighetsperiodeStart = formaterDatoForFrontend(addMonths(rettighetsperiodeStart, 6));

const baseSykdomsvurdering: Sykdomsvurdering = {
  fraDato: fraDatoSammeSomRettighetsperiodeStart,
  begrunnelse: 'Begrunnelse',
  harSkadeSykdomEllerLyte: JaEllerNei.Ja,
  kodeverk: 'ICD10',
  hoveddiagnose: { label: 'Kne', value: 'M001' },
  bidiagnose: [{ label: 'Rygg', value: 'M002' }],
  erArbeidsevnenNedsatt: JaEllerNei.Ja,
  erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Ja,
  erNedsettelseIArbeidsevneAvEnVissVarighet: JaEllerNei.Ja,
  erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Ja,
  erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Ja,
  erNedsettelseIArbeidsevneMerEnnFørtiProsent: JaEllerNei.Ja,
  yrkesskadeBegrunnelse: 'Yrkesskade begrunnelse',
  behøverVurdering: true,
  erNyVurdering: true,
};

describe('mapTilPeriodisertVurdering', () => {
  describe('felles felt', () => {
    it('skal alltid mappe begrunnelse', () => {
      const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, false, false, rettighetsperiodeStart);
      expect(result.begrunnelse).toBe(baseSykdomsvurdering.begrunnelse);
    });

    // Brukes aldri? Kan fjernes hvis det ikke er tiltenkt å brukes i fremtiden
    it('skal alltid returnere tom liste for dokumenterBruktIVurdering', () => {
      const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, false, false, rettighetsperiodeStart);
      expect(result.dokumenterBruktIVurdering).toEqual([]);
    });

    it('skal formatere fom-dato til backend-format', () => {
      const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, false, false, rettighetsperiodeStart);
      expect(result.fom).toBe('2024-01-01');
    });

    it('skal sette tom til tilDato når den er oppgitt', () => {
      const result = mapTilPeriodisertVurdering(
        baseSykdomsvurdering,
        false,
        false,
        rettighetsperiodeStart,
        '2024-12-31'
      );
      expect(result.tom).toBe('2024-12-31');
    });

    it('skal sette tom til undefined når tilDato ikke er oppgitt', () => {
      const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, false, false, rettighetsperiodeStart);
      expect(result.tom).toBeUndefined();
    });
  });

  describe('harSkadeSykdomEllerLyte = Nei', () => {
    const data: Sykdomsvurdering = { ...baseSykdomsvurdering, harSkadeSykdomEllerLyte: JaEllerNei.Nei };

    it('skal sette harSkadeSykdomEllerLyte til false', () => {
      const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
      expect(result.harSkadeSykdomEllerLyte).toBe(false);
    });

    it('skal nullstille kodeverk, diagnoser og erArbeidsevnenNedsatt', () => {
      const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
      expect(result.kodeverk).toBeUndefined();
      expect(result.hoveddiagnose).toBeUndefined();
      expect(result.bidiagnoser).toBeUndefined();
      expect(result.erArbeidsevnenNedsatt).toBeUndefined();
    });

    it('skal nullstille alle arbeidsevne- og yrkesskade-felt', () => {
      const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
      expect(result.erNedsettelseIArbeidsevneMerEnnHalvparten).toBeUndefined();
      expect(result.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined();
      expect(result.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
      expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
      expect(result.yrkesskadeBegrunnelse).toBeUndefined();
    });
  });

  describe('harSkadeSykdomEllerLyte = Ja', () => {
    it('skal sette harSkadeSykdomEllerLyte til true og mappe diagnoser', () => {
      const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, false, false, rettighetsperiodeStart);
      expect(result.harSkadeSykdomEllerLyte).toBe(true);
      expect(result.kodeverk).toBe('ICD10');
      expect(result.hoveddiagnose).toBe('M001');
      expect(result.bidiagnoser).toEqual(['M002']);
    });

    it('skal mappe bidiagnoser fra flere diagnose-verdier', () => {
      const data: Sykdomsvurdering = {
        ...baseSykdomsvurdering,
        bidiagnose: [
          { label: 'Rygg', value: 'M002' },
          { label: 'Skulder', value: 'M003' },
        ],
      };
      const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
      expect(result.bidiagnoser).toEqual(['M002', 'M003']);
    });

    it('skal mappe til en tom liste når det ikke er bidiagnoser', () => {
      const data: Sykdomsvurdering = { ...baseSykdomsvurdering, bidiagnose: [] };
      const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
      expect(result.bidiagnoser).toEqual([]);
    });

    it('skal mappe undefined som hoveddiagnose når den ikke er satt', () => {
      const data: Sykdomsvurdering = { ...baseSykdomsvurdering, hoveddiagnose: null };
      const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
      expect(result.hoveddiagnose).toBeUndefined();
    });

    describe('erArbeidsevnenNedsatt = Nei', () => {
      const data: Sykdomsvurdering = { ...baseSykdomsvurdering, erArbeidsevnenNedsatt: JaEllerNei.Nei };

      it('skal sette erArbeidsevnenNedsatt til false', () => {
        const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
        expect(result.erArbeidsevnenNedsatt).toBe(false);
      });

      it('skal nullstille alle arbeidsevne- og yrkesskade-felt', () => {
        const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
        expect(result.erNedsettelseIArbeidsevneMerEnnHalvparten).toBeUndefined();
        expect(result.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined();
        expect(result.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
        expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
        expect(result.yrkesskadeBegrunnelse).toBeUndefined();
      });
    });

    describe('erArbeidsevnenNedsatt = Ja, ingen yrkesskade', () => {
      describe('fraDato lik eller før rettighetsperiodeStart', () => {
        it('skal bruke erNedsettelseIArbeidsevneMerEnnHalvparten (Ja) og kaskadere videre', () => {
          const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, false, false, rettighetsperiodeStart);
          expect(result.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(true);
          expect(result.erSkadeSykdomEllerLyteVesentligdel).toBe(true);
          expect(result.erNedsettelseIArbeidsevneAvEnVissVarighet).toBe(true);
        });

        it('skal bruke erNedsettelseIArbeidsevneMerEnnHalvparten (Nei) og nullstille videre-felt', () => {
          const data: Sykdomsvurdering = {
            ...baseSykdomsvurdering,
            erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Nei,
          };
          const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
          expect(result.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(false);
          expect(result.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined();
          expect(result.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
        });

        it('skal nullstille erNedsettelseIArbeidsevneAvEnVissVarighet når erSkadeSykdomEllerLyteVesentligdel er false', () => {
          const data: Sykdomsvurdering = {
            ...baseSykdomsvurdering,
            erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Nei,
          };
          const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
          expect(result.erSkadeSykdomEllerLyteVesentligdel).toBe(false);
          expect(result.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
        });

        it('skal ikke sette yrkesskade-felt', () => {
          const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, false, false, rettighetsperiodeStart);
          expect(result.yrkesskadeBegrunnelse).toBeUndefined();
          expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
        });
      });

      describe('fraDato etter rettighetsperiodeStart', () => {
        it('skal bruke erNedsettelseIArbeidsevneMerEnnFørtiProsent (Ja) i stedet for halvparten', () => {
          const data: Sykdomsvurdering = {
            ...baseSykdomsvurdering,
            fraDato: fraDatoEtterRettighetsperiodeStart,
            erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Nei,
            erNedsettelseIArbeidsevneMerEnnFørtiProsent: JaEllerNei.Ja,
          };
          const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
          expect(result.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(true);
        });

        it('skal bruke erNedsettelseIArbeidsevneMerEnnFørtiProsent (Nei) i stedet for halvparten', () => {
          const data: Sykdomsvurdering = {
            ...baseSykdomsvurdering,
            fraDato: fraDatoEtterRettighetsperiodeStart,
            erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Ja,
            erNedsettelseIArbeidsevneMerEnnFørtiProsent: JaEllerNei.Nei,
          };
          const result = mapTilPeriodisertVurdering(data, false, false, rettighetsperiodeStart);
          expect(result.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(false);
        });

        it('skal ikke sette yrkesskade-felt selv om skalVurdereYrkesskade er true', () => {
          const data: Sykdomsvurdering = {
            ...baseSykdomsvurdering,
            fraDato: fraDatoEtterRettighetsperiodeStart,
          };
          const result = mapTilPeriodisertVurdering(data, true, false, rettighetsperiodeStart);
          expect(result.yrkesskadeBegrunnelse).toBeUndefined();
          expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
        });
      });
    });

    describe('erArbeidsevnenNedsatt = Ja, med yrkesskade (skalVurdereYrkesskade = true)', () => {
      describe('fraDato lik rettighetsperiodeStart og erNedsettelseIArbeidsevneMerEnnHalvparten = Nei', () => {
        const data: Sykdomsvurdering = {
          ...baseSykdomsvurdering,
          erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Nei,
        };

        it('skal sette yrkesskadeBegrunnelse', () => {
          const result = mapTilPeriodisertVurdering(data, true, false, rettighetsperiodeStart);
          expect(result.yrkesskadeBegrunnelse).toBe('Yrkesskade begrunnelse');
        });

        it('skal mappe erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense (Ja)', () => {
          const result = mapTilPeriodisertVurdering(data, true, false, rettighetsperiodeStart);
          expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBe(true);
        });

        it('skal mappe erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense (Nei)', () => {
          const dataWithNei: Sykdomsvurdering = {
            ...data,
            erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Nei,
          };
          const result = mapTilPeriodisertVurdering(dataWithNei, true, false, rettighetsperiodeStart);
          expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBe(false);
        });

        it('skal mappe erSkadeSykdomEllerLyteVesentligdel via yrkesskadegrense', () => {
          const result = mapTilPeriodisertVurdering(data, true, false, rettighetsperiodeStart);
          expect(result.erSkadeSykdomEllerLyteVesentligdel).toBe(true);
        });

        it('skal nullstille erSkadeSykdomEllerLyteVesentligdel hvis yrkesskadegrense er false', () => {
          const dataWithNei: Sykdomsvurdering = {
            ...data,
            erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Nei,
          };
          const result = mapTilPeriodisertVurdering(dataWithNei, true, false, rettighetsperiodeStart);
          expect(result.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined();
          expect(result.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
        });
      });

      describe('fraDato lik rettighetsperiodeStart og erNedsettelseIArbeidsevneMerEnnHalvparten = Ja', () => {
        it('skal ikke begrunne yrkesskade fordi halvparten er oppfylt', () => {
          const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, true, false, rettighetsperiodeStart);
          expect(result.yrkesskadeBegrunnelse).toBeUndefined();
          expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
        });

        it('skal fortsatt mappe erSkadeSykdomEllerLyteVesentligdel via halvparten', () => {
          const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, true, false, rettighetsperiodeStart);
          expect(result.erSkadeSykdomEllerLyteVesentligdel).toBe(true);
          expect(result.erNedsettelseIArbeidsevneAvEnVissVarighet).toBe(true);
        });
      });
    });

    /*
     * erÅrsakssammenhengYrkesskade:
     *  kommer kun ved revurdering dersom det ble oppgitt årsakssammenheng i førstegangsbehandlingen
     */
    describe('erArbeidsevnenNedsatt = Ja, med årsakssammenheng (erÅrsakssammenhengYrkesskade = true)', () => {
      describe('fraDato etter rettighetsperiodeStart', () => {
        const data: Sykdomsvurdering = {
          ...baseSykdomsvurdering,
          fraDato: fraDatoEtterRettighetsperiodeStart,
        };

        it('skal mappe erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense', () => {
          const result = mapTilPeriodisertVurdering(data, false, true, rettighetsperiodeStart);
          expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBe(true);
        });

        it('skal ikke sette yrkesskadeBegrunnelse', () => {
          const result = mapTilPeriodisertVurdering(data, false, true, rettighetsperiodeStart);
          expect(result.yrkesskadeBegrunnelse).toBeUndefined();
        });

        it('skal mappe erSkadeSykdomEllerLyteVesentligdel via yrkesskadegrense', () => {
          const result = mapTilPeriodisertVurdering(data, false, true, rettighetsperiodeStart);
          expect(result.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined;
        });

        it('skal nullstille resterende felter hvis yrkesskadegrense er false', () => {
          const dataWithNei: Sykdomsvurdering = {
            ...data,
            erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Nei,
          };
          const result = mapTilPeriodisertVurdering(dataWithNei, false, true, rettighetsperiodeStart);
          expect(result.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined();
          expect(result.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
        });
      });

      /*
       * skalVurdereYrkesskade:
       *  Vil være TRUE dersom behandlingsflyt har funnet yrkesskade i registeret
       */
      describe('fraDato lik rettighetsperiodeStart og skalVurdereYrkesskade = true', () => {
        it('nedsettelse mer enn halvparten - skal IKKE begrunne yrkesskade', () => {
          const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, true, false, rettighetsperiodeStart);
          expect(result.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(true);
          expect(result.yrkesskadeBegrunnelse).toBeUndefined();
          expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
        });

        it('skal begrunne yrkesskade og mappe yrkesskadegrense', () => {
          const data: Sykdomsvurdering = {
            ...baseSykdomsvurdering,
            erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Nei, // dette tvinger begrunnelse av yrk
          };
          const result = mapTilPeriodisertVurdering(data, true, false, rettighetsperiodeStart);
          expect(result.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(false);
          expect(result.yrkesskadeBegrunnelse).toBe('Yrkesskade begrunnelse');
          expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBe(true);
        });
      });

      describe('fraDato lik rettighetsperiodeStart og skalVurdereYrkesskade = false', () => {
        it('skal ikke begrunne yrkesskade', () => {
          const result = mapTilPeriodisertVurdering(baseSykdomsvurdering, false, false, rettighetsperiodeStart);
          expect(result.yrkesskadeBegrunnelse).toBeUndefined();
          expect(result.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
        });
      });
    });
  });
});
