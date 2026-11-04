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
