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
 *
 * Radene som lages merkes med perioden de kommer fra, slik at en ny beregning først kan slå dem
 * sammen igjen. Da kan saksbehandler rette opp feriedatoene og få riktig resultat, i stedet for
 * at en ny splitt legger seg oppå den forrige.
 */
export function beregnForhåndsvisning<T extends SplittbarRad>(rader: T[]): T[] {
  const ferieRader = sorterEtterFom(rader.filter((n) => n.ytelseType === 'FERIE_I_SYKEPENGEPERIODE'));
  const ikkeFerieRader = rader.filter((n) => n.ytelseType !== 'FERIE_I_SYKEPENGEPERIODE');

  let resultat = slåSammenSykepengeperioderUtenGyldigMellomrom(ikkeFerieRader, ferieRader);

  ferieRader.forEach((rad) => {
    resultat = splittForEnFerie(resultat, rad);
  })

  return sorterEtterFom(resultat.concat(ferieRader));
}

function slåSammenSykepengeperioderUtenGyldigMellomrom<T extends SplittbarRad>(rader: T[], ferieRader: T[]): T[] {
  const andreRader = rader.filter((n) => n.ytelseType !== 'SYKEPENGER');
  let sykepengeRader = sorterEtterFom(rader.filter((n) => n.ytelseType === 'SYKEPENGER'));

  let slåttSammen = true;
  while (slåttSammen) {
    slåttSammen = false;

    for (let i = 0; i < sykepengeRader.length - 1; i++) {
      const denne = tilPeriode(sykepengeRader[i]);
      const neste = tilPeriode(sykepengeRader[i + 1]);

      if (!denne || !neste || neste.fom <= denne.tom) {
        continue;
      }

      const gapFom = addDays(denne.tom, 1);
      const gapTom = subDays(neste.fom, 1);
      const gapDekketAvFerie =
        gapFom <= gapTom &&
        ferieRader.some((ferie) => ferie.periode.fom === format(gapFom, DATOFORMAT) && ferie.periode.tom === format(gapTom, DATOFORMAT));

      if (!gapDekketAvFerie) {
        const sammenslått = medPeriode(sykepengeRader[i], denne.fom, neste.tom);
        sykepengeRader = [...sykepengeRader.slice(0, i), sammenslått, ...sykepengeRader.slice(i + 2)];
        slåttSammen = true;
        break;
      }
    }
  }

  return [...sykepengeRader, ...andreRader];
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
  const ferieRadPeriode = tilPeriode(ferieRad)

  if (!ferieRadPeriode) {
    return rader;
  }

  rader.forEach((rad) => {
    const sykepengeperiode = rad === ferieRad ? undefined : tilPeriode(rad);

    if (
      rad.ytelseType !== 'SYKEPENGER' ||
      !sykepengeperiode ||
      !overlapper(sykepengeperiode, ferieRadPeriode)
    ) {
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
