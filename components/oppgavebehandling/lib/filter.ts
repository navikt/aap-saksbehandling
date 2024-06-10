import { Kø } from 'components/oppgavebehandling/KøContext';
import { FilterDTO } from 'lib/types/oppgavebehandling';

export const byggFilterFraKø = (navn: string, beskrivelse: string, kø: Kø): Omit<FilterDTO, 'id'> => {
  return {
    tittel: navn,
    beskrivelse: beskrivelse,
    filter: JSON.stringify({
      flervalgsfilter: kø.flervalgsfilter?.map((f) => ({
        navn: f.navn,
        valgteFilter: f.valgteFilter,
      })),
      fritekstfilter: kø.fritekstfilter,
      sortering: kø.sortering,
    }),
  };
};
