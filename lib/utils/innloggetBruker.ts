import type { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { Roller } from 'lib/types/types';

export function brukerharNayTilgang(bruker: BrukerInformasjon) {
  return bruker.roller.includes(Roller.SAKSBEHANDLER_NASJONAL) || bruker.roller.includes(Roller.BESLUTTER);
}
export function brukerKanSaksbehandle(bruker: BrukerInformasjon) {
  return bruker.roller.some((rolle) =>
    [Roller.SAKSBEHANDLER_OPPFØLGING, Roller.SAKSBEHANDLER_NASJONAL].includes(rolle)
  );
}
export function brukerErBeslutter(bruker: BrukerInformasjon) {
  return bruker.roller.includes(Roller.BESLUTTER);
}
