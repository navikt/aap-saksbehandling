import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  cookies: vi.fn<() => Promise<{ get: (name: string) => { value?: string } | undefined }>>(),
  cookieGet: vi.fn<(name: string) => { value?: string } | undefined>(),
  headers: vi.fn<() => Promise<Headers>>(),
  isLocal: vi.fn<() => boolean>(),
  isDev: vi.fn<() => boolean>(),
  getAccessTokenOrRedirectToLogin: vi.fn<(requestHeaders: Headers) => string>(),
  decodeJwt: vi.fn<(token: string) => Record<string, unknown>>(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
  headers: mocks.headers,
}));
vi.mock('./azuread', () => ({
  getAccessTokenOrRedirectToLogin: mocks.getAccessTokenOrRedirectToLogin,
}));
vi.mock('lib/utils/environment', () => ({
  isDev: mocks.isDev,
  isLocal: mocks.isLocal,
}));
vi.mock('jose', () => ({
  decodeJwt: mocks.decodeJwt,
}));

import { hentInnloggetBrukerInformasjon } from './azureUserService';

describe('hentInnloggetBrukerInformasjon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.cookies.mockResolvedValue({ get: mocks.cookieGet });
    mocks.headers.mockResolvedValue(new Headers());
    mocks.isLocal.mockReturnValue(true);
    mocks.isDev.mockReturnValue(false);
    mocks.cookieGet.mockReturnValue(undefined);
  });

  it.each([
    ['V123456', 'Veileder', 'veileder-rolle'],
    ['K123456', 'Kvalitetssikrer', 'kvalitetssikrer-rolle'],
    ['S123456', 'Saksbehandler', 'saksbehandler-rolle'],
    ['B123456', 'Beslutter', 'beslutter-rolle'],
  ])('returnerer riktig lokal ident og rolle for %s', async (ident, rolle, gruppe) => {
    mocks.cookieGet.mockReturnValue({ value: ident });

    await expect(hentInnloggetBrukerInformasjon()).resolves.toEqual({
      navn: `${ident} (${rolle})`,
      NAVident: ident,
      grupper: [gruppe],
      roller: [rolle],
    });
    expect(mocks.cookieGet).toHaveBeenCalledExactlyOnceWith('bruker');
    expect(mocks.headers).not.toHaveBeenCalled();
    expect(mocks.getAccessTokenOrRedirectToLogin).not.toHaveBeenCalled();
  });

  it.each([
    ['dev', true, '33e00155-169b-41e5-8a3f-5582ed975a15', 'Veileder'],
    ['prod', false, '5763b52f-f16a-483d-8f40-25be9de95c0a', 'Beslutter'],
  ])('beholder UUID-rollekoblingen i %s uten å lese cookies', async (_miljø, erDev, gruppe, rolle) => {
    mocks.isLocal.mockReturnValue(false);
    mocks.isDev.mockReturnValue(erDev);
    const requestHeaders = new Headers({ authorization: 'Bearer access-token' });
    mocks.headers.mockResolvedValue(requestHeaders);
    mocks.getAccessTokenOrRedirectToLogin.mockReturnValue('jwt-token');
    mocks.decodeJwt.mockReturnValue({
      name: 'Testbruker',
      NAVident: 'Z123456',
      groups: [gruppe],
    });

    await expect(hentInnloggetBrukerInformasjon()).resolves.toEqual({
      navn: 'Testbruker',
      NAVident: 'Z123456',
      roller: [rolle],
    });

    expect(mocks.cookies).not.toHaveBeenCalled();
    expect(mocks.cookieGet).not.toHaveBeenCalled();
    expect(mocks.headers).toHaveBeenCalledOnce();
    expect(mocks.getAccessTokenOrRedirectToLogin).toHaveBeenCalledWith(requestHeaders);
    expect(mocks.decodeJwt).toHaveBeenCalledWith('jwt-token');
  });
});
