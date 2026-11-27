// @vitest-environment-options {"settings":{"enableIframePageLoading":true}}

import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { SWRConfig } from 'swr';
import { postmottakHentDokumentClient, postmottakHentJournalposterClient } from 'lib/postmottakClientApi';
import { JournalpostOversikt, JournalposterRespons } from 'lib/types/postmottakTypes';
import { SplitVindu } from 'components/postmottak/splitvindu/SplitVindu';

vi.unmock('swr');
vi.mock('lib/postmottakClientApi', () => ({
  postmottakHentDokumentClient: vi.fn(),
  postmottakHentJournalposterClient: vi.fn(),
}));

const createObjectURL = vi.fn(() => 'about:blank');
const revokeObjectURL = vi.fn();
const journalpost: JournalpostOversikt = {
  journalpostId: '22',
  tittel: 'Samtykke',
  tema: 'AAP',
  dato: '2026-11-27T10:00:00',
  dokumenter: [
    { dokumentInfoId: 'felles-id', tittel: 'Signert samtykke', kanForhaandsvises: true },
    { dokumentInfoId: 'uten-forhandsvisning', tittel: 'Vedlegg uten arkivvariant', kanForhaandsvises: false },
  ],
};

function svar(data: JournalposterRespons) {
  return { type: 'SUCCESS' as const, status: 200, data };
}

function visDokumenter(visAlleJournalposter = true) {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <SplitVindu
        visAlleJournalposter={visAlleJournalposter}
        behandlingsreferanse="behandling"
        journalpostId={11}
        dokumenter={[{ dokumentInfoId: 'felles-id', tittel: 'Søknad' }]}
      >
        Behandlingssteg
      </SplitVindu>
    </SWRConfig>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = createObjectURL;
      static revokeObjectURL = revokeObjectURL;
    }
  );
  vi.mocked(postmottakHentDokumentClient).mockResolvedValue(new Blob(['pdf']));
  vi.mocked(postmottakHentJournalposterClient).mockResolvedValue(
    svar({ journalposter: [journalpost], finnesNesteSide: false })
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('starter med behandlingens dokument og bruker riktig journalpost ved bytte, også med lik dokument-ID', async () => {
  const user = userEvent.setup();
  visDokumenter();
  await screen.findByTitle('Dokumentvisning');
  expect(postmottakHentDokumentClient).toHaveBeenLastCalledWith('11', 'felles-id', expect.any(AbortSignal));
  await user.click(await screen.findByRole('tab', { name: /Signert samtykke.*22/ }));

  await waitFor(() =>
    expect(postmottakHentDokumentClient).toHaveBeenLastCalledWith('22', 'felles-id', expect.any(AbortSignal))
  );
  expect(screen.getByRole('tab', { name: /Signert samtykke.*22/ })).toHaveAttribute('aria-selected', 'true');
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  expect(revokeObjectURL).toHaveBeenCalled();
});

it('henter ikke dokumenter som backend sier ikke kan forhåndsvises', async () => {
  const user = userEvent.setup();
  visDokumenter();
  await user.click(await screen.findByRole('tab', { name: /Signert samtykke.*22/ }));
  await screen.findByTitle('Dokumentvisning');
  const kallFørBytte = vi.mocked(postmottakHentDokumentClient).mock.calls.length;
  await user.click(screen.getByRole('tab', { name: /Vedlegg uten arkivvariant.*22/ }));

  expect(screen.getByText('Dette dokumentet kan ikke forhåndsvises.')).toBeVisible();
  expect(screen.queryByTitle('Dokumentvisning')).not.toBeInTheDocument();
  expect(postmottakHentDokumentClient).toHaveBeenCalledTimes(kallFørBytte);
});

it('følger sluttpeker også etter en tom side og unngår duplikater', async () => {
  const user = userEvent.setup();
  vi.mocked(postmottakHentJournalposterClient)
    .mockResolvedValueOnce(svar({ journalposter: [], finnesNesteSide: true, sluttpeker: 'side+2/=' }))
    .mockResolvedValueOnce(svar({ journalposter: [journalpost, journalpost], finnesNesteSide: false }));
  visDokumenter();
  await user.click(await screen.findByRole('button', { name: 'Last flere journalposter' }));

  await screen.findByRole('tab', { name: /Signert samtykke.*22/ });
  expect(postmottakHentJournalposterClient).toHaveBeenLastCalledWith('behandling', 'side+2/=');
  expect(screen.getAllByRole('tab')).toHaveLength(3);
  expect(screen.queryByRole('button', { name: 'Last flere journalposter' })).not.toBeInTheDocument();
});

it('viser listefeil og lar saksbehandler prøve igjen uten å miste behandlingens dokument', async () => {
  const user = userEvent.setup();
  vi.mocked(postmottakHentJournalposterClient).mockResolvedValueOnce({
    type: 'ERROR',
    status: 503,
    apiException: { message: 'Utilgjengelig' },
  });
  visDokumenter();
  expect(await screen.findByText('Kunne ikke hente journalpostlisten.')).toBeVisible();
  expect(await screen.findByTitle('Dokumentvisning')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Prøv igjen' }));

  expect(await screen.findByRole('tab', { name: /Signert samtykke.*22/ })).toBeVisible();
  expect(screen.queryByText('Kunne ikke hente journalpostlisten.')).not.toBeInTheDocument();
});

it('viser dokumentfeil i stedet for en ødelagt PDF og støtter nytt forsøk', async () => {
  const user = userEvent.setup();
  vi.mocked(postmottakHentDokumentClient).mockRejectedValueOnce(new Error('HTTP 403'));
  visDokumenter();
  expect(await screen.findByText('Kunne ikke hente dokumentet.')).toBeVisible();
  expect(screen.queryByTitle('Dokumentvisning')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Prøv igjen' }));

  expect(await screen.findByTitle('Dokumentvisning')).toBeVisible();
});

it('ignorerer et sent dokumentsvar etter at saksbehandler har byttet journalpost', async () => {
  const user = userEvent.setup();
  let fullfør: (blob: Blob) => void = () => {
    throw new Error('Dokumentkallet har ikke startet');
  };
  vi.mocked(postmottakHentDokumentClient).mockImplementationOnce(
    () =>
      new Promise<Blob>((resolve) => {
        fullfør = resolve;
      })
  );
  visDokumenter();
  await user.click(await screen.findByRole('tab', { name: /Signert samtykke.*22/ }));
  await screen.findByTitle('Dokumentvisning');
  expect(createObjectURL).toHaveBeenCalledTimes(1);
  await act(async () => fullfør(new Blob(['gammelt dokument'])));
  expect(createObjectURL).toHaveBeenCalledTimes(1);
});

it('beholder bare behandlingens dokumenter og henter ikke journalpostlisten for vanlige behandlinger', async () => {
  visDokumenter(false);

  expect(await screen.findByTitle('Dokumentvisning')).toBeVisible();
  expect(screen.getAllByRole('tab')).toHaveLength(1);
  expect(screen.getByRole('tab', { name: 'Søknad' })).toHaveAttribute('aria-selected', 'true');
  expect(postmottakHentJournalposterClient).not.toHaveBeenCalled();
  expect(screen.queryByText('Kunne ikke hente journalpostlisten.')).not.toBeInTheDocument();
});
