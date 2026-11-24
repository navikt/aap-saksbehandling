import { GjenståendeSykedager } from 'lib/types/oppgaveTypes';
import { Dato } from 'lib/types/Dato';

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
    if (gjenståendeSykedager.maksdato) {
      return new Dato(gjenståendeSykedager.maksdato).formaterForFrontend();
    } else {
      return mapGrunnlagTilTekst(gjenståendeSykedager.grunnlag);
    }
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
