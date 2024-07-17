import { describe, test, expect } from 'vitest';
import { Kø } from 'components/oppgavebehandling/KøContext';
import { byggQueryString } from 'components/oppgavebehandling/lib/query';
import { ComboboxOption } from '@navikt/ds-react/esm/form/combobox/types';

const filter1: ComboboxOption = { label: 'Første valg', value: 'verdi1' };
const filter2: ComboboxOption = { label: 'Andre valg', value: 'verdi2' };

const køUtenFilter: Kø = {
  id: 1,
  navn: 'en kø',
  beskrivelse: 'Dette er en testkø',
  flervalgsfilter: [
    {
      navn: 'parameter1',
      alleFilter: [filter1, filter2],
      valgteFilter: [],
    },
  ],
};

const køMedEttFiltervalg: Kø = {
  id: 1,
  navn: 'en kø',
  beskrivelse: 'Dette er en testkø',
  flervalgsfilter: [
    {
      navn: 'parameter1',
      alleFilter: [filter1, filter2],
      valgteFilter: [filter2],
    },
  ],
};

const køMedToFilterValg: Kø = {
  id: 1,
  navn: 'en kø',
  beskrivelse: 'Dette er en testkø',
  flervalgsfilter: [
    {
      navn: 'parameter1',
      alleFilter: [filter1, filter2],
      valgteFilter: [filter1, filter2],
    },
  ],
};

const køMedSynkendeSortering: Kø = {
  id: 1,
  navn: 'en kø',
  beskrivelse: 'Dette er en testkø',
  sortering: {
    orderBy: 'parameter1',
    direction: 'descending',
  },
};

const køMedStigendeSortering: Kø = {
  id: 1,
  navn: 'en kø',
  beskrivelse: 'Dette er en testkø',
  sortering: {
    orderBy: 'parameter1',
    direction: 'ascending',
  },
};

const køMedFritekstfilter: Kø = {
  id: 1,
  navn: 'en kø',
  beskrivelse: 'Dette er en testkø',
  fritekstfilter: [{ navn: 'fritekst1', verdi: 'fritekstverdi1' }],
};

describe('query utils', () => {
  test('gir tom streng når det ikke er valgt noen filter eller sortering', () => {
    const res = byggQueryString(køUtenFilter);
    expect(res).toEqual('');
  });

  test('prefixer filter med "filtrering"', () => {
    const res = byggQueryString(køMedEttFiltervalg);
    expect(res).toMatch(/^filtrering.*/);
  });

  test('bygger på format parameternavn%3Dparameternavnverdi', () => {
    const res = byggQueryString(køMedEttFiltervalg);
    const searchparams = new URLSearchParams();
    searchparams.append('filtrering[parameter1]', 'verdi2');
    expect(res).toEqual(searchparams.toString());
  });

  test('gjentar mønsteret parameternavn%3Dparameternavnverdi for hver verdi på et parameter', () => {
    const res = byggQueryString(køMedToFilterValg);
    const searchparams = new URLSearchParams();
    searchparams.append('filtrering[parameter1]', 'verdi1');
    searchparams.append('filtrering[parameter1]', 'verdi2');
    expect(res).toEqual(searchparams.toString());
  });

  test('prefixer sortering med "sortering"', () => {
    const res = byggQueryString(køMedSynkendeSortering);
    expect(res).toMatch(/^sortering/);
  });

  test('lager sorteringsstreng for parameter1 i synkende rekkefølge', () => {
    const res = byggQueryString(køMedSynkendeSortering);
    const sort = new URLSearchParams();
    sort.append('sortering[parameter1]', 'desc');
    expect(res).toEqual(sort.toString());
  });

  test('lager sorteringsstreng for parameter1 i stigende rekkefølge', () => {
    const res = byggQueryString(køMedStigendeSortering);
    const sort = new URLSearchParams();
    sort.append('sortering[parameter1]', 'asc');
    expect(res).toEqual(sort.toString());
  });

  test('bygger søkestreng for fritekstparameter', () => {
    const res = byggQueryString(køMedFritekstfilter);
    const searchParams = new URLSearchParams();
    searchParams.append('filtrering[fritekst1]', 'fritekstverdi1');
    expect(res).toEqual(searchParams.toString());
  });

  test('bygger søkestreng for både fritekst og flervalgsparameter', () => {
    const køMedAlt: Kø = {
      id: 1,
      navn: 'en kø',
      beskrivelse: 'En testkø',
      fritekstfilter: [
        {
          navn: 'fritekst1',
          verdi: 'verdi1',
        },
      ],
      flervalgsfilter: [
        {
          navn: 'flervalg1',
          alleFilter: [filter1],
          valgteFilter: [filter1],
        },
      ],
    };
    const res = byggQueryString(køMedAlt);
    const searchParams = new URLSearchParams();
    searchParams.append('filtrering[flervalg1]', `${filter1.value}`);
    searchParams.append('filtrering[fritekst1]', `verdi1`);
    expect(res).toEqual(searchParams.toString());
  });

  test('tomt fritekstfelt skal ikke gi filtrering i querystring', () => {
    const køMedTomFritekst: Kø = {
      id: 1,
      navn: 'en kø',
      beskrivelse: 'Kø',
      fritekstfilter: [
        {
          navn: 'fritekst1',
          verdi: undefined,
        },
      ],
    };
    const res = byggQueryString(køMedTomFritekst);
    expect(res).toEqual('');
  });
});
