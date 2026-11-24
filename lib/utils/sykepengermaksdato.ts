import { GjenståendeSykedager } from 'lib/types/oppgaveTypes';
import { Dato } from 'lib/types/Dato';
import { addDays, isWeekend } from 'date-fns';

/**
 * Vis dato hvis sykepenger er i Speil.
 * Maksdato er kun satt dersom grunnlaget er VEDTAK_I_NY_LØSNING, MAKSDATO_I_INFOTRYGD eller SISTE_UTBETALING_I_INFOTRYGD, https://spokelse.intern.nav.no/swagger
 */

const grunnlagMedMaksdato: GjenståendeSykedager['grunnlag'][] = [
  'VEDTAK_I_NY_LØSNING',
  'MAKSDATO_I_INFOTRYGD',
  'SISTE_UTBETALING_I_INFOTRYGD',
];

export function utledMaksdatoFraSykepenger(gjenståendeSykedager?: GjenståendeSykedager): string | undefined {
  if (!gjenståendeSykedager) {
    return undefined;
  }

  if (grunnlagMedMaksdato.includes(gjenståendeSykedager.grunnlag)) {
    const maksdato = gjenståendeSykedager.maksdato
      ? new Dato(gjenståendeSykedager.maksdato)
      : utledMaksdato(gjenståendeSykedager.gjenståendeDager, gjenståendeSykedager.vurdertTilOgMed);

    return maksdato ? maksdato.formaterForFrontend() : mapGrunnlagTilTekst(gjenståendeSykedager.grunnlag);
  } else {
    return '';
  }
}

function mapGrunnlagTilTekst(grunnlag: GjenståendeSykedager['grunnlag']): string {
  switch (grunnlag) {
    case 'INGEN_SYKEPENGER_SISTE_26_UKER':
      return 'Ingen sykepenger siste 26 uker';
    case 'MAKSDATO_I_INFOTRYGD':
      return 'Maksdato i Infotrygd';
    case 'MANGLER_MAKSDATO_I_INFOTRYGD':
      return 'Mangler maksdato i Infotrygd';
    case 'SISTE_UTBETALING_I_INFOTRYGD':
      return 'Siste utbetaling i Infotrygd';
    case 'VEDTAK_I_NY_LØSNING':
      return 'Vedtak i ny løsning';
  }
}

/**
 * Vi har tilfeller hvor vi ikke har utledet maksdato i backend da vi var på en tidligere versjon av api-et fra sykepenger.
 * Må utlede på nytt her da vi har feltene gjenståendeDager og vurdertTilOgMed.
 * Teller kun mandag–fredag fra dagen etter vurdertTilOgMed. Helligdager på hverdager telles som vanlige hverdager.
 *
 * Denne er midlertidig og kan fjernes på et tidspunkt.
 */
function utledMaksdato(gjenståendeDager?: number | null, vurdertTilOgMed?: string | null): Dato | null {
  if (gjenståendeDager == null || !vurdertTilOgMed) {
    return null;
  }

  let dato = new Dato(vurdertTilOgMed).dato;
  let gjenstående = gjenståendeDager;

  // Går én kalenderdag frem om gangen, og teller ned kun for hverdager.
  // Startdatoen teller ikke, og ved 0 dager returneres den uendret.
  while (gjenstående > 0) {
    dato = addDays(dato, 1);
    if (!isWeekend(dato)) {
      gjenstående--;
    }
  }
  return new Dato(dato);
}
