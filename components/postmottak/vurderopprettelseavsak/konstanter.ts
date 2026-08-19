/**
 * Hvor langt tilbake i tid vi slår opp ytelsesperioder for søker i steget «Avklar fordeling».
 * Foreldrepenger følger 52-ukersvurderingen, sykepenger ser kun på de siste par månedene.
 *
 * Verdiene brukes både ved henting av data og i teksten som vises til saksbehandler,
 * og må derfor deles for å unngå at de kommer ut av synk.
 */
export const ANTALL_UKER_TILBAKE_FORELDREPENGER = 52;
export const ANTALL_MANEDER_TILBAKE_SYKEPENGER = 2;
