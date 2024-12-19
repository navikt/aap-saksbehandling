import { AktivitetspliktBrudd } from 'lib/types/types';
import { DatoBruddPåAktivitetsplikt } from 'components/aktivitetsplikt/aktivitetspliktform/AktivitetspliktForm';

export function hentDatoLabel(valgtBrudd: AktivitetspliktBrudd): string {
  switch (valgtBrudd) {
    case 'IKKE_MØTT_TIL_MØTE':
      return 'Dato for ikke møtt i tiltak';
    case 'IKKE_MØTT_TIL_BEHANDLING_ELLER_UTREDNING':
      return 'Dato for ikke møtt til behandling eller utredning';
    case 'IKKE_MØTT_TIL_TILTAK':
      return 'Dato for ikke møtt til tiltak';
    case 'IKKE_MØTT_TIL_ANNEN_AKTIVITET':
      return 'Dato for ikke møtt til annen aktivitet';
    case 'IKKE_SENDT_INN_DOKUMENTASJON':
      return 'Dato for ikke sendt inn dokumentasjon';
    case 'IKKE_AKTIVT_BIDRAG':
      return 'Dato for ikke bidratt til egen avklaring';
    default: {
      return 'Dato for fravær';
    }
  }
}

export function formaterPerioder(perioder: DatoBruddPåAktivitetsplikt[], brudd: AktivitetspliktBrudd) {
  return perioder.map((periode) => {
    if (periode.type === 'enkeltdag') {
      if (brudd === 'IKKE_AKTIVT_BIDRAG') {
        return { fom: periode.dato, tom: undefined };
      } else {
        return { fom: periode.dato, tom: periode.dato };
      }
    } else {
      return { fom: periode.fom, tom: periode.tom };
    }
  });
}
