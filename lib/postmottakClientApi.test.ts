import { afterEach, expect, it, vi } from 'vitest';
import { clientFetch } from 'lib/clientApi';
import { postmottakHentDokumentClient, postmottakHentJournalposterClient } from './postmottakClientApi';

vi.mock('lib/clientApi', () => ({ clientFetch: vi.fn() }));

afterEach(() => {
  vi.unstubAllGlobals();
});

it('bevarer SAF-sluttpekere med spesialtegn i queryparameteren', () => {
  postmottakHentJournalposterClient('behandling', 'neste+side/=');
  expect(clientFetch).toHaveBeenCalledWith(
    '/postmottak/api/post/behandling/journalposter?etter=neste%2Bside%2F%3D',
    'GET'
  );
});

it('avviser HTTP-feil fra dokumenthentingen i stedet for å returnere dem som PDF', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Ingen tilgang', { status: 403 })));

  await expect(postmottakHentDokumentClient('22', 'dokument')).rejects.toThrow('HTTP 403');
});

it('henter valgt journalpost og dokument og videresender avbruddssignalet', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response('pdf', { headers: { 'Content-Type': 'application/pdf' } }));
  vi.stubGlobal('fetch', fetch);
  const controller = new AbortController();

  const blob = await postmottakHentDokumentClient('22', 'dokument', controller.signal);

  expect(fetch).toHaveBeenCalledWith('/postmottak/api/post/dokumenter/22/dokument', {
    method: 'GET',
    signal: controller.signal,
  });
  expect(await blob.text()).toBe('pdf');
});
