import { Kø } from 'components/oppgavebehandling/KøContext';
import { byggQueryString } from 'components/oppgavebehandling/lib/query';
import { ComboboxOption } from '@navikt/ds-react/esm/form/combobox/types';

const filter1: ComboboxOption = { label: 'Første valg', value: 'verdi1' };
const filter2: ComboboxOption = { label: 'Andre valg', value: 'verdi2' };

const køUtenFilter: Kø = {
  id: '1',
  navn: 'en kø',
  beskrivelse: 'Dette er en testkø',
  filter: [
    {
      navn: 'parameter1',
      alleFilter: [filter1, filter2],
      valgteFilter: [],
    },
  ],
};

const køMedEttFiltervalg: Kø = {
  id: '1',
  navn: 'en kø',
  beskrivelse: 'Dette er en testkø',
  filter: [
    {
      navn: 'parameter1',
      alleFilter: [filter1, filter2],
      valgteFilter: [filter2],
    },
  ],
};

const køMedToFilterValg: Kø = {
  id: '1',
  navn: 'en kø',
  beskrivelse: 'Dette er en testkø',
  filter: [
    {
      navn: 'parameter1',
      alleFilter: [filter1, filter2],
      valgteFilter: [filter1, filter2],
    },
  ],
};

describe('query utils', () => {
  test('gir tom streng når det ikke er valgt noen filter eller sortering', () => {
    const res = byggQueryString(køUtenFilter.filter);
    expect(res).toEqual('');
  });

  test('prefixer filter med "filtrering="', () => {
    const res = byggQueryString(køMedEttFiltervalg.filter);
    expect(res).toMatch(/^filtrering=.*/);
  });

  test('bygger på format parameternavn%3Dparameternavnverdi', () => {
    const res = byggQueryString(køMedEttFiltervalg.filter);
    const searchparams = new URLSearchParams();
    searchparams.append('filtrering', 'parameter1=verdi2');
    expect(res).toEqual(searchparams.toString());
  });

  test('gjentar mønsteret parameternavn%3Dparameternavnverdi for hver verdi på et parameter', () => {
    const res = byggQueryString(køMedToFilterValg.filter);
    const searchparams = new URLSearchParams();
    searchparams.append('filtrering', 'parameter1=verdi1&parameter1=verdi2');
    expect(res).toEqual(searchparams.toString());
  });
});
