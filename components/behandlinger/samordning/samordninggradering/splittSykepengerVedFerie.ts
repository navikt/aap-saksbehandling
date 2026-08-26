import { addDays, differenceInCalendarDays, format, isValid, parse, subDays } from 'date-fns';
import { SamordningYtelsestype } from 'lib/types/types';

const DATOFORMAT = 'dd.MM.yyyy';

interface PeriodeFelt {
  fom: string;
  tom: string;
}

interface SplittbarRad {
  ytelseType?: SamordningYtelsestype;
  periode: PeriodeFelt;
  opprinneligPeriode?: PeriodeFelt;
}

interface Splittresultat<T> {
  rader: T[];
  endredeIndekser: number[];
}

/**
 * Ferie i en sykepengeperiode forskyver maksdato for sykepenger tilsvarende lengden på ferien.
 * Antall sykepengedager bevares: dagene før ferien blir stående, og de resterende dagene
 * legges som en egen rad rett etter ferieslutt.
 *
 * Radene som lages merkes med perioden de kommer fra, slik at en ny beregning først kan slå dem
 * sammen igjen. Da kan saksbehandler rette opp feriedatoene og få riktig resultat, i stedet for
 * at en ny splitt legger seg oppå den forrige.
 */
export function splittSykepengerVedFerie<T extends SplittbarRad>(rader: T[], ferieIndex: number): Splittresultat<T> {
  const ferieRad = rader[ferieIndex];
  const tilbakestilte = slåSammenSplittedeRader(rader);
  const ferie = tilPeriode(ferieRad);

  if (ferieRad?.ytelseType !== 'FERIE_I_SYKEPENGEPERIODE' || !ferie) {
    return { rader: tilbakestilte, endredeIndekser: [] };
  }

  const nyeRader: T[] = [];
  const endredeIndekser: number[] = [];

  tilbakestilte.forEach((rad) => {
    const sykepengeperiode = rad === ferieRad ? undefined : tilPeriode(rad);

    if (rad.ytelseType !== 'SYKEPENGER' || !sykepengeperiode || !overlapper(sykepengeperiode, ferie)) {
      nyeRader.push(rad);
      return;
    }

    forskyvSykepenger(rad, sykepengeperiode, ferie).forEach((splittetRad) => {
      endredeIndekser.push(nyeRader.length);
      nyeRader.push(splittetRad);
    });
  });

  return { rader: nyeRader, endredeIndekser };
}

function slåSammenSplittedeRader<T extends SplittbarRad>(rader: T[]): T[] {
  const resultat: T[] = [];
  let sistGjenopprettet: PeriodeFelt | undefined;

  rader.forEach((rad) => {
    if (!rad.opprinneligPeriode) {
      sistGjenopprettet = undefined;
      resultat.push(rad);
      return;
    }

    if (sistGjenopprettet && erSammePeriode(sistGjenopprettet, rad.opprinneligPeriode)) {
      return;
    }

    sistGjenopprettet = rad.opprinneligPeriode;
    resultat.push({ ...rad, periode: rad.opprinneligPeriode, opprinneligPeriode: undefined });
  });

  return resultat;
}

function forskyvSykepenger<T extends SplittbarRad>(rad: T, sykepenger: Periode, ferie: Periode): T[] {
  const antallDager = antallDagerMellom(sykepenger.fom, sykepenger.tom);
  const opprinneligPeriode = rad.periode;
  const resultat: T[] = [];

  const dagerFørFerien = ferie.fom > sykepenger.fom ? antallDagerMellom(sykepenger.fom, subDays(ferie.fom, 1)) : 0;

  if (dagerFørFerien > 0) {
    resultat.push(medPeriode(rad, sykepenger.fom, subDays(ferie.fom, 1), opprinneligPeriode));
  }

  const dagerIgjen = antallDager - dagerFørFerien;

  if (dagerIgjen > 0) {
    const fom = addDays(ferie.tom, 1);
    resultat.push(medPeriode(rad, fom, addDays(fom, dagerIgjen - 1), opprinneligPeriode));
  }

  return resultat;
}

interface Periode {
  fom: Date;
  tom: Date;
}

function tilPeriode(rad: SplittbarRad | undefined): Periode | undefined {
  const fom = parse(rad?.periode.fom ?? '', DATOFORMAT, new Date());
  const tom = parse(rad?.periode.tom ?? '', DATOFORMAT, new Date());

  if (!isValid(fom) || !isValid(tom) || fom > tom) {
    return undefined;
  }

  return { fom, tom };
}

function overlapper(en: Periode, annen: Periode): boolean {
  return en.fom <= annen.tom && annen.fom <= en.tom;
}

function erSammePeriode(en: PeriodeFelt, annen: PeriodeFelt): boolean {
  return en.fom === annen.fom && en.tom === annen.tom;
}

function antallDagerMellom(fom: Date, tom: Date): number {
  return differenceInCalendarDays(tom, fom) + 1;
}

function medPeriode<T extends SplittbarRad>(rad: T, fom: Date, tom: Date, opprinneligPeriode: PeriodeFelt): T {
  return {
    ...rad,
    periode: { fom: format(fom, DATOFORMAT), tom: format(tom, DATOFORMAT) },
    opprinneligPeriode,
  };
}
