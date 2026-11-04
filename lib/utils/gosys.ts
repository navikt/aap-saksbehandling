import { GosysOppgave } from 'lib/types/gosysTypes';
import { sorterEtterEldsteDato, sorterEtterNyesteDato } from 'lib/utils/date';

export interface GosysSortering {
  orderBy: 'opprettetTidspunkt' | 'fristFerdigstillelse';
  direction: 'ascending' | 'descending';
}

export function sorterGosysOppgaver(oppgaver: GosysOppgave[], sortering?: GosysSortering): GosysOppgave[] {
  if (!sortering) return oppgaver;

  return [...oppgaver].sort((a, b) => {
    const datoA = a[sortering.orderBy];
    const datoB = b[sortering.orderBy];

    if (!datoA) return datoB ? 1 : 0;
    if (!datoB) return -1;

    return sortering.direction === 'ascending'
      ? sorterEtterEldsteDato(datoA, datoB)
      : sorterEtterNyesteDato(datoA, datoB);
  });
}

export function mapOppgaveTypeTilTekst(oppgavetype: string): string {
  switch (oppgavetype) {
    case 'KONT_BRUK':
      return 'Kontakt bruker';
    case 'VUR_KONS_YTE':
      return 'Vurder konsekvens for ytelse';
    case 'INNH_DOK':
      return 'Innhent dokumentasjon';
    case 'JFR':
      return 'Journalføring';
    case 'VURD_HENV':
      return 'Vurder henvendelse';
    case 'BEH_SED':
      return 'Behandle SED';
    case 'RETUR':
      return 'Behandle returpost';
    case 'SVAR_IK_MOT':
      return 'Svar ikke mottatt';
    case 'VURD_NOTAT':
      return 'Vurder notat';
    case 'VUR_SVAR':
      return 'Vurder svar';
    default:
      return oppgavetype;
  }
}
