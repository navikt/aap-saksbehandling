import { GjenståendeSykedager } from 'lib/types/oppgaveTypes';
import { Dato } from 'lib/types/Dato';

/**
 * Vis dato hvis sykepenger er i Speil.
 * Vis "SP i Infotrygd" hvis sykepenger er i Infotrygd
 * Maksdato er kun satt dersom grunnlaget er VEDTAK_I_NY_LØSNING, https://spokelse.intern.nav.no/swagger
 */
export function utledMaksdatoFraSykepenger(gjenståendeSykedager?: GjenståendeSykedager): string | undefined {
  if (!gjenståendeSykedager) {
    return undefined;
  }

  if (gjenståendeSykedager.grunnlag === 'VEDTAK_I_NY_LØSNING' && gjenståendeSykedager.maksdato) {
    return new Dato(gjenståendeSykedager.maksdato).formaterForFrontend();
  } else if (gjenståendeSykedager.grunnlag === 'SISTE_UTBETALING_I_INFOTRYGD') {
    return 'SP i Infotrygd';
  }
}
