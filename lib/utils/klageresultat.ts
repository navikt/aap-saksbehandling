import { Klageresultat } from 'lib/types/types';

export function formaterKlageresultat(klageresultat?: Klageresultat) {
  switch (klageresultat?.type) {
    case 'OPPRETTHOLDES':
      return 'Opprettholdes';
    case 'OMGJØRES':
      return 'Omgjøres';
    case 'AVSLÅTT':
      return 'Avslått på formkrav';
    case 'DELVIS_OMGJØRES':
      return 'Delvis omgjøres';
    case 'UFULLSTENDIG':
      return 'Under behandling';
    default:
      return 'Ukjent resultat';
  }
}
