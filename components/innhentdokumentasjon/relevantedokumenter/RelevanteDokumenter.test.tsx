import { render, screen } from '@testing-library/react';
import {
  RelevantDokumentType,
  RelevanteDokumenter,
} from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';

const relevanteDokumenter: RelevantDokumentType[] = [
  {
    tema: 'AAP',
    dokumentInfoId: 'diid',
    journalpostId: 'jpid',
    tittel: 'Sykemelding 39u',
    erUtgående: false,
    datoOpprettet: '2024-12-20',
    variantformat: 'ORIGINAL',
  },
];

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('Relevante dokumenter', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  test('har en overskrift som informerer om at det kan finnes relevante dokumenter', async () => {
    mockFetchRelevanteDokumenter(relevanteDokumenter);
    render(<RelevanteDokumenter />);
    expect(await screen.findByText('Følgende helseopplysninger kan være relevant for saken')).toBeVisible();
  });

  test('har en kort beskrivelse av hva disse dokumentene kan være', () => {
    mockFetchRelevanteDokumenter(relevanteDokumenter);
    render(<RelevanteDokumenter />);
    expect(
      screen.getByText(
        'NAV har tidligere mottatt følgende helseopplysninger som kan være relevant for brukers AAP sak. Velg dokumenter som er aktuelle for å koble de til saken.'
      )
    ).toBeVisible();
  });

  test('har et felt for å søke etter dokumenter som er listet ut', () => {
    mockFetchRelevanteDokumenter(relevanteDokumenter);
    render(<RelevanteDokumenter />);
    expect(screen.getByRole('textbox', { name: 'Søk i helseopplysninger' })).toBeVisible();
  });

  test('har et felt for å kunne filtrere dokumentlisten på typer', () => {
    mockFetchRelevanteDokumenter(relevanteDokumenter);
    render(<RelevanteDokumenter />);
    expect(screen.getByRole('combobox', { name: 'Vis typer' })).toBeVisible();
  });

  test('har en tabell for alle dokumenter som er funnet', () => {
    mockFetchRelevanteDokumenter(relevanteDokumenter);
    render(<RelevanteDokumenter />);
    expect(screen.getByRole('columnheader', { name: 'Dokument' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Type' })).toBeVisible();
  });

  test('tabellen kan sorteres på type', () => {
    mockFetchRelevanteDokumenter(relevanteDokumenter);
    render(<RelevanteDokumenter />);
    expect(screen.getByRole('button', { name: 'Type' })).toBeVisible();
  });

  test('viser en rad pr dokument', () => {
    mockFetchRelevanteDokumenter(relevanteDokumenter);
    render(<RelevanteDokumenter />);
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });
});

function mockFetchRelevanteDokumenter(dokumenter: RelevantDokumentType[]) {
  const response: FetchResponse<RelevantDokumentType[]> = {
    type: 'SUCCESS',
    status: 200,
    data: dokumenter,
  };

  fetchMock.mockResponseOnce(JSON.stringify(response), { status: 200 });
}
