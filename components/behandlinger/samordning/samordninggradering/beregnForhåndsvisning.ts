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
}

/**
 * Ferie i en sykepengeperiode forskyver maksdato for sykepenger tilsvarende lengden på ferien.
 * Antall sykepengedager bevares: dagene før ferien blir stående, og de resterende dagene
 * legges som en egen rad rett etter ferieslutt.
 */
export function beregnForhåndsvisning<T extends SplittbarRad>(rader: T[]): T[] {
  const ferieRader = sorterEtterFom(rader.filter((n) => n.ytelseType === 'FERIE_I_SYKEPENGEPERIODE'));
  let resultat = slåSammenSplittedeSykepengeperioder(rader).filter((n) => n.ytelseType !== 'FERIE_I_SYKEPENGEPERIODE');

  ferieRader.forEach((rad) => {
    resultat = splittForEnFerie(resultat, rad);
  });

  return sorterEtterFom(resultat.concat(ferieRader));
}

export function medAutoSplitt<T extends SplittbarRad>(rader: T[], autoSplittSykepenger: boolean): T[] {
  return autoSplittSykepenger ? beregnForhåndsvisning(rader) : rader;
}

export function slåSammenSplittedeSykepengeperioder<T extends SplittbarRad>(rader: T[]): T[] {
  const ferier = sorterEtterFom(rader.filter((n) => n.ytelseType === 'FERIE_I_SYKEPENGEPERIODE'))
    .map(tilPeriode)
    .filter((periode): periode is Periode => periode !== undefined);
  const andreRader = rader.filter((n) => n.ytelseType !== 'SYKEPENGER');
  const sykepengeRader = sorterEtterFom(rader.filter((n) => n.ytelseType === 'SYKEPENGER'));

  const resultat: T[] = [];
  let kjede: T[] = [];

  function avsluttKjede() {
    if (kjede.length === 0) {
      return;
    }

    const start = tilPeriode(kjede[0])!.fom;
    const antallDager = kjede.reduce((sum, rad) => {
      const periode = tilPeriode(rad)!;
      return sum + antallDagerMellom(periode.fom, periode.tom);
    }, 0);

    resultat.push(medPeriode(kjede[0], start, addDays(start, antallDager - 1)));
    kjede = [];
  }

  sykepengeRader.forEach((rad) => {
    const periode = tilPeriode(rad);

    if (!periode) {
      avsluttKjede();
      resultat.push(rad);
      return;
    }

    const forrige = kjede.length > 0 ? tilPeriode(kjede[kjede.length - 1]) : undefined;

    if (forrige && erDekketAvFerie(addDays(forrige.tom, 1), subDays(periode.fom, 1), ferier)) {
      kjede.push(rad);
    } else {
      avsluttKjede();
      kjede.push(rad);
    }
  });

  avsluttKjede();

  return sorterEtterFom(resultat.concat(andreRader));
}

function erDekketAvFerie(fom: Date, tom: Date, ferier: Periode[]): boolean {
  if (fom > tom) {
    return false;
  }

  let dekketTilOgMed = fom;

  for (const ferie of ferier) {
    if (ferie.fom > dekketTilOgMed) {
      break;
    }
    if (ferie.tom >= dekketTilOgMed) {
      dekketTilOgMed = addDays(ferie.tom, 1);
    }
  }

  return dekketTilOgMed > tom;
}

function sorterEtterFom<T extends SplittbarRad>(rader: T[]): T[] {
  return [...rader].sort((a, b) => {
    const periodeA = tilPeriode(a);
    const periodeB = tilPeriode(b);
    if (!periodeA || !periodeB) {
      return 0;
    }
    return periodeA.fom.getTime() - periodeB.fom.getTime();
  });
}

function splittForEnFerie<T extends SplittbarRad>(rader: T[], ferieRad: T): T[] {
  const nyeRader: T[] = [];
  const ferieRadPeriode = tilPeriode(ferieRad);

  if (!ferieRadPeriode) {
    return rader;
  }

  rader.forEach((rad) => {
    const sykepengeperiode = rad === ferieRad ? undefined : tilPeriode(rad);

    if (rad.ytelseType !== 'SYKEPENGER' || !sykepengeperiode || !overlapper(sykepengeperiode, ferieRadPeriode)) {
      nyeRader.push(rad);
      return;
    }

    forskyvSykepenger(rad, sykepengeperiode, ferieRadPeriode).forEach((splittetRad) => {
      nyeRader.push(splittetRad);
    });
  });

  return nyeRader;
}

function forskyvSykepenger<T extends SplittbarRad>(rad: T, sykepenger: Periode, ferie: Periode): T[] {
  const antallDager = antallDagerMellom(sykepenger.fom, sykepenger.tom);
  const resultat: T[] = [];

  const dagerFørFerien = ferie.fom > sykepenger.fom ? antallDagerMellom(sykepenger.fom, subDays(ferie.fom, 1)) : 0;

  if (dagerFørFerien > 0) {
    resultat.push(medPeriode(rad, sykepenger.fom, subDays(ferie.fom, 1)));
  }

  const dagerIgjen = antallDager - dagerFørFerien;

  if (dagerIgjen > 0) {
    const fom = addDays(ferie.tom, 1);
    resultat.push(medPeriode(rad, fom, addDays(fom, dagerIgjen - 1)));
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

function antallDagerMellom(fom: Date, tom: Date): number {
  return differenceInCalendarDays(tom, fom) + 1;
}

function medPeriode<T extends SplittbarRad>(rad: T, fom: Date, tom: Date): T {
  return {
    ...rad,
    periode: { fom: format(fom, DATOFORMAT), tom: format(tom, DATOFORMAT) },
  };
}
