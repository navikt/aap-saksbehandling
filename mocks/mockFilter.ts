import { FilterDTO } from 'lib/types/oppgavebehandling';

export const mockFilter: FilterDTO[] = [
  {
    id: 1,
    tittel: 'Revurdering og tilbakekreving',
    beskrivelse: 'Saker som gjelder revurdering og tilbakekreving',
    filter:
      '{"flervalgsfilter":[{"navn":"behandlingstype","valgteFilter":[{"value":"Revurdering","label":"Revurdering"},{"value":"Tilbakekreving","label":"Tilbakekreving"}]}],"sortering":{"orderBy":"behandlingOpprettetTid","direction":"ascending"}}',
  },
];
