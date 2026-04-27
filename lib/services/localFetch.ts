import { logError } from 'lib/serverutlis/logger';
import { cookies } from 'next/headers';

export async function hentLocalToken(scope: string) {
  const cookieStore = await cookies();
  const ident = cookieStore.get('bruker');

  if (!ident) {
    cookieStore.set({ name: 'bruker', value: 'VEILEDER' });
  }

  try {
    const params = new URLSearchParams({
      aud: scope,
      NAVident: ident?.value || '',
      groups: ['saksbehandler-rolle', 'veileder-rolle', 'kvalitetssikrer-rolle', 'beslutter-rolle'].join(','),
    });

    const url = new URL('https://fakedings.intern.dev.nav.no/fake/aad?' + params.toString());
    return fetch(url, { method: 'POST', next: { revalidate: 0 } }).then((token) => token.text());
  } catch (err) {
    logError('hentLocalToken feilet', err);
    return Promise.resolve('dummy-token');
  }
}
