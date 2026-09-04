import type { UmamiHendelserVarighetEvent } from 'lib/utils/umami/hendelserVarighet';
import type { UmamiLenkeKlikkEvent } from 'lib/utils/umami/lenkeKlikk';
import type { UmamiNavigeringEvent } from 'lib/utils/umami/navigering';
import type { UmamiVarighetEvent } from 'lib/utils/umami/varighet';
import { UmamiSykdomsvurderingEvent } from 'lib/utils/umami/sykdomsvurdering';

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
  | UmamiNavigeringEvent
  | UmamiSykdomsvurderingEvent;
