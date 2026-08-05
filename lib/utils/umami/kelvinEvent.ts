import type { UmamiHendelserVarighetEvent } from 'lib/utils/umami/hendelserVarighet';
import { UMAMI_HENDELSER_SERIE_KONTEKST } from 'lib/utils/umami/hendelserVarighet';
import type { UmamiLenkeKlikkEvent } from 'lib/utils/umami/lenkeKlikk';
import type { UmamiNavigeringEvent } from 'lib/utils/umami/navigering';
import { UMAMI_NAVIGERING_MÅL, UMAMI_OPPGAVE_HANDLING } from 'lib/utils/umami/navigering';
import { UMAMI_STEG } from 'lib/utils/umami/steg';
import type { UmamiVarighetEvent } from 'lib/utils/umami/varighet';

/**
 * `UmamiKelvinEvent` er en diskriminert union på `type`-feltet — hver variant har kun de feltene
 * den faktisk trenger. Feltnavnene i payloaden til `/api/umami` (`hendelser_serie`, `delhendelse`,
 * `lenketekst`, `inngang` osv.) er *ikke* reservert av Umami — vi eier dem selv og velger et navn
 * som beskriver hva feltet faktisk inneholder for den aktuelle hendelse-typen, i stedet for å
 * gjenbruke et generisk feltnavn på tvers av alle typer.
 */
export type UmamiKelvinEvent =
  | UmamiVarighetEvent
  | UmamiHendelserVarighetEvent
  | UmamiLenkeKlikkEvent
  | UmamiNavigeringEvent;

/**
 * Alle gyldige verdier for `UmamiKelvinEvent['name']`. Siden dette er en kjøretids-array kan den
 * logges direkte, f.eks. `console.log(UMAMI_KELVIN_EVENT_NAMES).
 */
export const UMAMI_KELVIN_EVENT_NAMES = [
  ...UMAMI_STEG.map((steg) => `STEG_${steg}_VARIGHET` as const),
  ...UMAMI_HENDELSER_SERIE_KONTEKST.map((kontekst) => `${kontekst}_HENDELSER_VARIGHET` as const),
  'EKSTERN_LENKE_KLIKK',
  ...UMAMI_NAVIGERING_MÅL.map((mål) => `GÅ_TIL_${mål}` as const),
  ...UMAMI_OPPGAVE_HANDLING.map((handling) => `${handling}_OPPGAVE` as const),
] as const satisfies readonly UmamiKelvinEvent['name'][];
