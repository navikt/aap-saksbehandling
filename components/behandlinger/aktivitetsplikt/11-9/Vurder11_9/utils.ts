import { Brudd } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';

export function formaterBrudd(brudd: Brudd) {
  switch (brudd) {
    case 'IKKE_MØTT_TIL_TILTAK':
      return 'Ikke møtt til tiltak';
    case 'IKKE_MØTT_TIL_BEHANDLING':
      return 'Ikke møtt til behandling';
    case 'IKKE_MØTT_TIL_MØTE':
      return 'Ikke møtt til møte med Nav';
    case 'IKKE_SENDT_DOKUMENTASJON':
      return 'Ikke sendt inn dokumentasjon som Nav har bedt om';
    default:
      return brudd;
  }
}

export function formaterGrunn(grunn: string) {
  switch (grunn) {
    case 'IKKE_RIMELIG_GRUNN':
      return 'Uten rimelig grunn';
    case 'RIMELIG_GRUNN':
      return 'Rimelig grunn';
    default:
      return grunn;
  }
}
