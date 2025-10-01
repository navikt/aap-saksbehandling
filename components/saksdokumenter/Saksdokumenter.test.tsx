import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Saksdokumenter } from 'components/saksdokumenter/Saksdokumenter';
import { userEvent } from '@testing-library/user-event';
import { FetchResponse } from 'lib/utils/api';
import { mockSWRImplementation } from 'lib/test/testUtil';
import { Journalpost, Journalposttype, Journalstatus } from 'lib/types/journalpost';

const toDokument: FetchResponse<Journalpost[]> = {
  data: [
    {
      tittel: 'søknad.pdf',
      journalpostId: '456',
      journalstatus: Journalstatus.FERDIGSTILT,
      tema: 'AAP',
      datoOpprettet: '2024-12-12',
      journalposttype: Journalposttype.U,
      dokumenter: [
        {
          dokumentInfoId: '123',
          tittel: 'søknad.pdf',
          brevkode: 'arkiv',
          dokumentvarianter: [],
        },
      ],
    },
    {
      tittel: 'legeerklæring.pdf',
      journalpostId: '123',
      journalstatus: Journalstatus.FERDIGSTILT,
      tema: 'AAP',
      datoOpprettet: '2024-12-12',
      journalposttype: Journalposttype.U,
      dokumenter: [
        {
          dokumentInfoId: '456',
          tittel: 'legeerklæring.pdf',
          brevkode: 'arkiv',
          dokumentvarianter: [],
        },
      ],
    },
    {
      tittel: 'annet_dokument.pdf',
      journalpostId: '222',
      journalstatus: Journalstatus.FERDIGSTILT,
      tema: 'AAP',
      datoOpprettet: '2024-12-12',
      journalposttype: Journalposttype.U,
      dokumenter: [
        {
          dokumentInfoId: '111',
          tittel: 'annet_dokument.pdf',
          brevkode: 'arkiv',
          dokumentvarianter: [],
        },
      ],
    },
    {
      tittel: 'forvaltningsmelding.pdf',
      journalpostId: '333',
      journalstatus: Journalstatus.JOURNALFOERT,
      tema: 'AAP',
      datoOpprettet: '2024-12-12',
      journalposttype: Journalposttype.I,
      dokumenter: [
        {
          dokumentInfoId: '222',
          tittel: 'forvaltningsmelding.pdf',
          brevkode: 'arkiv',
          dokumentvarianter: [],
        },
      ],
    },
    {
      tittel: 'enda_en.pdf',
      journalpostId: '555',
      journalstatus: Journalstatus.FERDIGSTILT,
      tema: 'AAP',
      datoOpprettet: '2024-12-12',
      journalposttype: Journalposttype.U,
      dokumenter: [
        {
          dokumentInfoId: '444',
          tittel: 'enda_en.pdf',
          brevkode: 'arkiv',
          dokumentvarianter: [],
        },
      ],
    },
    {
      tittel: 'blabla.pdf',
      journalpostId: '7897',
      journalstatus: Journalstatus.FERDIGSTILT,
      tema: 'AAP',
      datoOpprettet: '2024-12-12',
      journalposttype: Journalposttype.U,
      dokumenter: [
        {
          dokumentInfoId: '4566',
          tittel: 'blabla.pdf',
          brevkode: 'arkiv',
          dokumentvarianter: [],
        },
      ],
    },
    {
      tittel: 'digitalisert_dokument.pdf',
      journalpostId: '666',
      journalstatus: Journalstatus.FERDIGSTILT,
      tema: 'AAP',
      datoOpprettet: '2024-12-12',
      journalposttype: Journalposttype.U,
      dokumenter: [
        {
          dokumentInfoId: '666',
          tittel: 'digitalisert_dokument.pdf',
          brevkode: 'arkiv',
          dokumentvarianter: [],
        },
      ],
    },
    {
      tittel: 'siste_dokument.pdf',
      journalpostId: '777',
      journalstatus: Journalstatus.FERDIGSTILT,
      tema: 'AAP',
      datoOpprettet: '2024-12-12',
      journalposttype: Journalposttype.U,
      dokumenter: [
        {
          dokumentInfoId: '777',
          tittel: 'siste_dokument.pdf',
          brevkode: 'arkiv',
          dokumentvarianter: [],
        },
      ],
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

  const søkefelt = screen.getByRole('textbox', { name: /søk i dokumenttitler/i });

  await user.type(søkefelt, 'sø');

  expect(screen.getByRole('link', { name: /søknad\.pdf/i })).toBeVisible();
  expect(screen.queryByRole('link', { name: /legeerklæring\.pdf/i })).not.toBeInTheDocument();
});

test('skal ha et felt for å kunne søke etter tittel på dokument', async () => {
  render(<Saksdokumenter />);
  expect(await screen.findByRole('textbox', { name: /søk i dokumenttitler/i })).toBeVisible();
});

test('skal ha en tabell med type, tittel, brevkode og journalført i header', async () => {
  render(<Saksdokumenter />);
  const type = await screen.findByRole('columnheader', { name: /type/i });
  const tittel = await screen.findByRole('columnheader', { name: /tittel/i });
  const brevkode = await screen.findByRole('columnheader', { name: /brevkode/i });
  const journalført = await screen.findByRole('columnheader', { name: /journalført/i });

  expect(type).toBeVisible();
  expect(tittel).toBeVisible();
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
