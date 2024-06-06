import { FilterDTO } from 'lib/types/oppgavebehandling';

export const mockFilter: FilterDTO[] = [
  {
    tittel: 'Første filter',
    beskrivelse: 'Første testfilter',
    filter: '{"sortering":{"orderBy":"foedselsnummer","direction":"ascending"}}',
  },
  {
    tittel: 'Andre filter',
    beskrivelse: 'Andre testfilter',
    filter: '{"sortering":{"orderBy":"foedselsnummer","direction":"descending"}}',
  },
  {
    tittel: 'Tredje filter',
    beskrivelse: 'Tredje testfilter',
    filter:
      '{"sortering":{"orderBy":"foedselsnummer","direction":"descending"},"fritekstfilter":[{"navn":"foedselsnummer","verdi":"1234"}]}',
  },
  {
    tittel: 'Fjerde filter',
    beskrivelse: 'Fjerde testfilter',
    filter:
      '{"flervalgsfilter":[{"navn":"avklaringsbehov","valgteFilter":[{"label":"Fastsett arbeidsevne","value":"FASTSETT_ARBEIDSEVNE"},{"label":"Behov for bistand","value":"AVKLAR_BISTANDSBEHOV"}]}]}',
  },
];
