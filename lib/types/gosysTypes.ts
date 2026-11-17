import { components, operations } from './gosysSchema';

export type FinnGosysOppgaverQueryParams = NonNullable<operations['finnOppgaver']['parameters']['query']>;
export type FinnGosysOppgaverResponse = operations['finnOppgaver']['responses'][200]['content']['application/json'];
export type GosysOppgave = components['schemas']['Oppgave'];

export enum GosysOppgavetype {
  KONTAKT_BRUKER = 'KONT_BRUK',
  VURDER_KONSEKVENS_FOR_YTELSE = 'VUR_KONS_YTE',
  INNHENT_DOKUMENTASJON = 'INNH_DOK',
  JOURNALFOERING = 'JFR',
  VURDER_HENVENDELSE = 'VURD_HENV',
  BEHANDLE_SED = 'BEH_SED',
  BEHANDLE_RETURPOST = 'RETUR',
  SVAR_IKKE_MOTTATT = 'SVAR_IK_MOT',
  VURDER_NOTAT = 'VURD_NOTAT',
  VURDER_SVAR = 'VUR_SVAR',
  BEHANDLE_HENVENDELSE = 'BEH_HENV',
  KONTROLLER_UTGAAENDE_SKANNEDE_DOKUMENTER = 'KON_UTG_SCA_DOK',
}
