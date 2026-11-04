export function mapOppgaveTypeTilTekst(oppgavetype: string): string {
  switch (oppgavetype) {
    case 'KONT_BRUK':
      return 'Kontakt bruker';
    case 'VUR_KONS_YTE':
      return 'Vurder ytterligere konsekvens';
    case 'INNH_DOK':
      return 'Innhent dokumentasjon';
    case 'VURD_NOTAT':
      return 'Vurder notat';
    default:
      return oppgavetype;
  }
}

export function mapGosysKategoriTilTekst(kode?: string): string {
  switch (kode) {
    case 'ab0269':
      return 'Medlemskap';
    case 'ab0570':
      return 'Avbryt revurdering';
    case 'ae0292':
      return 'Kelvin';
    case 'ae0294':
      return 'Klage - Kelvin';
    default:
      return kode ?? '';
  }
}
