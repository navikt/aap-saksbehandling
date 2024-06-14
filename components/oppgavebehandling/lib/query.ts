import { Kø } from 'components/oppgavebehandling/KøContext';

export const byggQueryString = (valgtKø: Kø | undefined) => {
  const flervalgsfilter = valgtKø?.flervalgsfilter
    ?.map((filterValg) => {
      const filternavn = filterValg.navn;
      return filterValg.valgteFilter.map((vf) => vf.value).map((u) => `filtrering[${filternavn}]=${u}`);
    })
    .flat();

  const fritekstfilter = valgtKø?.fritekstfilter
    ?.filter((filtervalg) => !!filtervalg.verdi)
    .map((filtervalg) => `filtrering[${filtervalg.navn}]=${filtervalg.verdi}`);

  const soekeparams: string[] = [];

  if (flervalgsfilter && flervalgsfilter.length > 0) {
    soekeparams.push(...flervalgsfilter);
  }
  if (fritekstfilter && fritekstfilter.length > 0) {
    soekeparams.push(...fritekstfilter);
  }

  const querystring = soekeparams.join('&');

  const search = new URLSearchParams(querystring);

  if (valgtKø?.sortering) {
    search.append(
      `sortering[${valgtKø.sortering.orderBy}]`,
      `${valgtKø.sortering.direction === 'ascending' ? 'asc' : 'desc'}`
    );
  }

  return search.toString();
};
