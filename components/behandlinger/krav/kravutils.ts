import { KravVurdering, NyttKrav, OverstyrMuligRettFra, Søknadsdato } from 'lib/types/types';
import { KravType } from 'components/opprettsak/OpprettSakLocal';

export function finnSøknadsdato(vurdering: KravVurdering): Søknadsdato | null {
  switch (vurdering.type) {
    case 'NYTT_KRAV_AAP':
      return (vurdering as NyttKrav).søknadsdato;
    default:
      return null;
  }
}

export function finnOverstyrMuligRettFra(vurdering: KravVurdering): OverstyrMuligRettFra | null {
  switch (vurdering.type) {
    case 'NYTT_KRAV_AAP':
      return (vurdering as NyttKrav).overstyrMuligRettFra;
    default:
      return null;
  }
}

export function formaterKravtype(type: KravType) {
  switch (type) {
    case 'NYTT_KRAV_AAP':
      return 'Nytt krav';
    case 'KLAGE':
      return 'Klage';
    case 'GJENOPPTAK':
      return 'Gjenopptak';
    case 'TILLEGGSOPPLYSNING':
      return 'Tilleggsopplysning';
    case 'TRUKKET_SØKNAD':
      return 'Trukket søknad';
    default:
      return 'Ukjent';
  }
}
