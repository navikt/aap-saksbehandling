import { FilterValg } from 'components/oppgavebehandling/KøContext';

export const byggQueryString = (filter: FilterValg[] | undefined) => {
  const querystring = filter
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

  return search.toString();
};
