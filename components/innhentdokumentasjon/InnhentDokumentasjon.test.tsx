import { render, screen } from '@testing-library/react';
import { InnhentDokumentasjon } from 'components/innhentdokumentasjon/InnhentDokumentasjon';
import { LegeerklæringStatus } from 'lib/types/types';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

const testdata: LegeerklæringStatus[] = [
  {
    behandlerRef: '1234',
    dialogmeldingUuid: 'uuid-1',
    opprettet: '2024-08-12',
    personId: '12345678910',
    saksnummer: 'string',
    status: 'SENDT',
    behandlerNavn: 'Trude Lutt',
    fritekst: 'Fritekst til behandler',
  },
];

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

// noinspection JSUnusedGlobalSymbols
vi.mock('hooks/SakHook', () => ({
  useSak: () => ({
    sak: { saksnummer: '123', ident: '456' },
  }),
}));

describe('Innhent dokumentasjon', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('har en knapp for å åpne skjema for å etterspørre informasjon fra lege', () => {
    fetchMock.mockResponseOnce(JSON.stringify(testdata), { status: 200 });
    render(<InnhentDokumentasjon />);
    expect(screen.getByRole('button', { name: 'Be om opplysninger fra behandler' })).toBeVisible();
  });

  // TODO må refaktorere denne komponenten litt
  test.skip('viser en tabell over bestilte erklæringer', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(testdata), { status: 200 });
    render(<InnhentDokumentasjon />);
    expect(await screen.findAllByRole('row')).toHaveLength(testdata.length + 1);
  });
});
