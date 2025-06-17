import { logError } from 'lib/serverutlis/logger';
import { cookies } from 'next/headers';

export async function hentLocalToken(scope: string) {
  const cookieStore = await cookies();
  const ident = cookieStore.get('bruker');

  if (!ident) {
    cookieStore.set({ name: 'bruker', value: 'VEILEDER' });
  }

  let url = `http://localhost:8081/token/${ident?.value}`;
  if (scope === process.env.DOKUMENTMOTTAK_API_SCOPE) {
    url = 'http://localhost:8071/token';
  } else if (scope === process.env.STATISTIKK_API_SCOPE) {
    url = 'http://localhost:8091/token';
  }
  try {
    return fetch(url, { method: 'POST', next: { revalidate: 0 } })
      .then((res) => res.json())
      .then((data) => data?.access_token);
  } catch (err) {
    logError('hentLocalToken feilet', err);
    return Promise.resolve('dummy-token');
  }
}
