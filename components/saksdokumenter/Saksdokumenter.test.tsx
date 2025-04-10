import { afterEach, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';
import { DokumentInfo } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';

const etDokument: FetchResponse<DokumentInfo[]> = {
  type: 'SUCCESS',
  data: [
    {
      tittel: 'søknad.pdf',
      dokumentInfoId: '123',
      journalpostId: '456',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
  ],
};

const toDokument: FetchResponse<DokumentInfo[]> = {
  data: [
    {
      tittel: 'søknad.pdf',
      dokumentInfoId: '123',
      journalpostId: '456',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
    {
      tittel: 'legeerklæring.pdf',
      dokumentInfoId: '456',
      journalpostId: '789',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
  ],
  type: 'SUCCESS',
};

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

afterEach(() => {
  fetchMocker.resetMocks();
});

const user = userEvent.setup();

test('skal være mulig å søke etter et dokument', async () => {
  fetchMocker.resetMocks();
  mockFetchDokumenter(toDokument);
  render(<Saksdokumenter />);
  expect(await screen.findByRole('link', { name: /søknad\.pdf/i })).toBeVisible();
  expect(await screen.findByRole('link', { name: /legeerklæring\.pdf/i })).toBeVisible();

  const søkefelt = screen.getByRole('textbox', { name: /søk i dokumenter/i });

  await user.type(søkefelt, 'sø');

  expect(screen.getByRole('link', { name: /søknad\.pdf/i })).toBeVisible();
  expect(screen.queryByRole('link', { name: /legeerklæring\.pdf/i })).not.toBeInTheDocument();
});

test('skal ha et felt for å kunne søke etter tittel på dokument', async () => {
  mockFetchDokumenter(etDokument);
  render(<Saksdokumenter />);
  expect(await screen.findByRole('textbox', { name: /søk i dokumenter/i })).toBeVisible();
});

test('skal ha et felt for å kunne søke type', async () => {
  mockFetchDokumenter(etDokument);
  render(<Saksdokumenter />);
  expect(await screen.findByRole('combobox', { name: /vis typer/i })).toBeVisible();
});

test('skal ha en tabell med inn/ut, dokument, type og journalført i header', async () => {
  mockFetchDokumenter(etDokument);
  render(<Saksdokumenter />);
  const innUt = await screen.findByRole('columnheader', { name: /inn \/ ut/i });
  const dokument = await screen.findByRole('columnheader', { name: /dokument/i });
  const type = await screen.findByRole('columnheader', { name: /type/i });
  const journalført = await screen.findByRole('columnheader', { name: /journalført/i });

  expect(innUt).toBeVisible();
  expect(dokument).toBeVisible();
  expect(type).toBeVisible();
  expect(journalført).toBeVisible();
});

test.skip('Skal vise en feilmelding dersom responsen er av type error', async () => {
  mockFetchDokumenter({
    type: 'ERROR',
    apiException: { message: 'Uhåndtert feil i backend' },
    status: 400,
  });
  render(<Saksdokumenter />);

  const feilmelding = await screen.findByText('Uhåndtert feil i backend');
  expect(feilmelding).toBeVisible();
});

function mockFetchDokumenter(dokumenter: FetchResponse<DokumentInfo[]>) {
  fetchMock.mockResponseOnce(JSON.stringify(dokumenter), { status: 200 });
}
