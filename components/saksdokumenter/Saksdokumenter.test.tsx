import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';
import { userEvent } from '@testing-library/user-event';
import { FetchResponse } from 'lib/utils/api';
import { mockSWRImplementation } from 'lib/test/testUtil';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';

const toDokument: FetchResponse<RelevantDokumentType[]> = {
  data: [
    {
      tittel: 'søknad.pdf',
      dokumentInfoId: '123',
      journalpostId: '456',
      tema: 'AAP',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
    {
      tittel: 'legeerklæring.pdf',
      dokumentInfoId: '456',
      journalpostId: '123',
      tema: 'AAP',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
    {
      tittel: 'annet_dokument.pdf',
      dokumentInfoId: '111',
      journalpostId: '222',
      tema: 'AAP',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
    {
      tittel: 'forvaltningsmelding.pdf',
      dokumentInfoId: '222',
      journalpostId: '333',
      tema: 'AAP',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: false,
    },
    {
      tittel: 'enda_en.pdf',
      dokumentInfoId: '444',
      journalpostId: '555',
      tema: 'AAP',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
    {
      tittel: 'blabla.pdf',
      dokumentInfoId: '4566',
      journalpostId: '7897',
      tema: 'AAP',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
    {
      tittel: 'digitalisert_dokument.pdf',
      dokumentInfoId: '666',
      journalpostId: '666',
      tema: 'AAP',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
    {
      tittel: 'siste_dokument.pdf',
      dokumentInfoId: '777',
      journalpostId: '777',
      tema: 'AAP',
      variantformat: 'ARKIV',
      brevkode: 'arkiv',
      datoOpprettet: '2024-12-12',
      erUtgående: true,
    },
  ],
  type: 'SUCCESS',
  status: 200,
};

const user = userEvent.setup();

test('skal være mulig å søke etter et dokument', async () => {
  mockSWRImplementation({
    'api/dokumenter/sak/123': toDokument,
  });
  render(<Saksdokumenter />);
  expect(await screen.findByRole('link', { name: /søknad\.pdf/i })).toBeVisible();
  expect(await screen.findByRole('link', { name: /legeerklæring\.pdf/i })).toBeVisible();

  const søkefelt = screen.getByRole('textbox', { name: /søk i dokumenter/i });

  await user.type(søkefelt, 'sø');

  expect(screen.getByRole('link', { name: /søknad\.pdf/i })).toBeVisible();
  expect(screen.queryByRole('link', { name: /legeerklæring\.pdf/i })).not.toBeInTheDocument();
});

test('skal ha et felt for å kunne søke etter tittel på dokument', async () => {
  render(<Saksdokumenter />);
  expect(await screen.findByRole('textbox', { name: /søk i dokumenter/i })).toBeVisible();
});

test('skal ha en tabell med inn/ut, dokument, type og journalført i header', async () => {
  render(<Saksdokumenter />);
  const innUt = await screen.findByRole('columnheader', { name: /inn \/ ut/i });
  const dokument = await screen.findByRole('columnheader', { name: /dokument/i });
  const brevkode = await screen.findByRole('columnheader', { name: /brevkode/i });
  const journalført = await screen.findByRole('columnheader', { name: /journalført/i });

  expect(innUt).toBeVisible();
  expect(dokument).toBeVisible();
  expect(brevkode).toBeVisible();
  expect(journalført).toBeVisible();
});

test('Skal vise en feilmelding dersom responsen er av type error', async () => {
  mockSWRImplementation({
    'api/dokumenter/sak/123': { type: 'ERROR', apiException: { message: 'Uhåndtert feil i backend' }, status: 400 },
  });

  render(<Saksdokumenter />);

  const feilmelding = await screen.findByText('Uhåndtert feil i backend');
  expect(feilmelding).toBeVisible();
});

test('Skal vise paginering når det er mer enn syv dokumenter på en sak', async () => {
  mockSWRImplementation({
    'api/dokumenter/sak/123': toDokument,
  });
  render(<Saksdokumenter />);

  // Kun 7 dokumenter per side, da skal dokument nr. 8 ikke være synlig.
  expect(screen.queryByRole('link', { name: /siste_dokument\.pdf/i })).not.toBeInTheDocument();
  // nest siste dokument skal fortsatt synes
  expect(await screen.findByRole('link', { name: /digitalisert_dokument\.pdf/i })).toBeVisible();
});
