import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  cookies: vi.fn<() => Promise<{ get: (name: string) => { value?: string } | undefined }>>(),
  cookieGet: vi.fn<(name: string) => { value?: string } | undefined>(),
}));

vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
}));

import { hentLocalToken } from './localToken';

describe('hentLocalToken', () => {
  beforeEach(() => {
    mocks.cookies.mockResolvedValue({ get: mocks.cookieGet });
    mocks.cookieGet.mockReset();
    mocks.cookieGet.mockReturnValue(undefined);
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it.each([
    ['V123456', 'veileder-rolle'],
    ['K123456', 'kvalitetssikrer-rolle'],
    ['S123456', 'saksbehandler-rolle'],
    ['B123456', 'beslutter-rolle'],
  ])('henter token med kun riktig gruppe for %s', async (ident, gruppe) => {
    mocks.cookieGet.mockReturnValue({ value: ident });
    vi.mocked(fetch).mockResolvedValue(new Response('fake-token'));

    await expect(hentLocalToken('api://scope')).resolves.toBe('fake-token');

    expect(mocks.cookies).toHaveBeenCalledOnce();
    expect(mocks.cookieGet).toHaveBeenCalledExactlyOnceWith('bruker');
    const [url, options] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBeInstanceOf(URL);
    if (!(url instanceof URL)) {
      throw new Error('Forventet en URL');
    }
    expect(url.origin).toBe('https://fakedings.intern.dev.nav.no');
    expect(url.pathname).toBe('/fake/aad');
    expect(url.searchParams.get('aud')).toBe('api://scope');
    expect(url.searchParams.get('NAVident')).toBe(ident);
    expect(url.searchParams.getAll('groups')).toEqual([gruppe]);
    expect(options).toEqual({ method: 'POST', next: { revalidate: 0 } });
  });

  it('velger superbruker når cookien mangler', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('fake-token'));

    await hentLocalToken('api://scope');

    const [url] = vi.mocked(fetch).mock.calls[0];
    expect((url as URL).searchParams.get('NAVident')).toBe('X123456');
  });

  it('normaliserer eldre brukercookie før token hentes', async () => {
    mocks.cookieGet.mockReturnValue({ value: 'BESLUTTER' });
    vi.mocked(fetch).mockResolvedValue(new Response('fake-token'));

    await hentLocalToken('api://scope');

    const [url] = vi.mocked(fetch).mock.calls[0];
    expect((url as URL).searchParams.get('NAVident')).toBe('B123456');
    expect((url as URL).searchParams.getAll('groups')).toEqual(['beslutter-rolle']);
  });

  it('avviser mislykket tokenhenting med HTTP-status', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('unavailable', { status: 503 }));

    await expect(hentLocalToken('api://scope')).rejects.toThrow('Kunne ikke hente lokalt token (status 503).');
  });

  it('viderefører nettverksfeil', async () => {
    const nettverksfeil = new Error('Nettverket er utilgjengelig');
    vi.mocked(fetch).mockRejectedValue(nettverksfeil);

    await expect(hentLocalToken('api://scope')).rejects.toBe(nettverksfeil);
  });
});
