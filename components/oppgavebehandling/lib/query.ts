import { Kø } from 'components/oppgavebehandling/KøContext';

export const byggQueryString = (valgtKø: Kø | undefined) => {
  const querystring = valgtKø?.filter
    ?.map((filterValg) => {
      const filternavn = filterValg.navn;
      return filterValg.valgteFilter.map((vf) => vf.value).map((u) => `${filternavn}=${u}`);
    })
    .flat()
    .join('&');

  const search = new URLSearchParams();
  if (querystring && querystring?.length > 0) {
    search.append('filtrering', querystring);
  }

  if (valgtKø?.sortering) {
    search.append(
      'sortering',
      `${valgtKø.sortering.orderBy}=${valgtKø.sortering.direction === 'ascending' ? 'asc' : 'desc'}`
    );
  }

  return search.toString();
};
