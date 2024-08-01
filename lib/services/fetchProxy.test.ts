import createFetchMock from 'vitest-fetch-mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWithRetry } from 'lib/services/fetchProxy';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe('fetchWithRetry', () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
  });
  it('skal returnere respons ved 200 status kode', async () => {
    const dummyResponse = { meldingFraBackend: 'hei' };
    fetchMocker.once(JSON.stringify(dummyResponse), { status: 200, headers: { 'Content-Type': 'application/json' } });
    const response = await fetchWithRetry('url', 'GET', 'dummytoken', 3);
    expect(response).toEqual(dummyResponse);
  });
  it('skal returnere text respons ved 200 status kode og text content type', async () => {
    const dummyResponse = 'Denne meldingen er en tekst';
    fetchMocker.once(dummyResponse, { status: 200, headers: { 'Content-Type': 'text/text' } });
    const response = await fetchWithRetry('url', 'GET', 'dummytoken', 3);
    expect(response).toEqual(dummyResponse);
  });
  it('skal returnere undefined ved 204 status kode', async () => {
    fetchMocker.once('', { status: 204 });
    const response = await fetchWithRetry('url', 'GET', 'dummytoken', 3);
    expect(response).toBe(undefined);
  });
  it('skal kaste error ved 404 status kode', async () => {
    const nonExistingUrl = 'url';
    fetchMocker.once('', { status: 404 });
    expect(fetchWithRetry(nonExistingUrl, 'GET', 'dummytoken', 3)).rejects.toThrowError(
      `Ikke funnet: ${nonExistingUrl}`
    );
  });
  it('skal kaste error ved 500 status kode', async () => {
    const errorUrl = 'url';
    fetchMocker.once(JSON.stringify({ message: 'error' }), { status: 500 });
    expect(fetchWithRetry(errorUrl, 'GET', 'dummytoken', 3)).rejects.toThrowError(`Unable to fetch url: error`);
  });
});
