import { logError } from '@navikt/aap-felles-utils';

export async function hentLocalToken(scope: string) {
  let url = 'http://localhost:8081/token';
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
