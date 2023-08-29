import { BehandlingsInfo, OpprettTestcase, SaksInfo, UtvidetSaksInfo } from './types/types';

export async function fetcher<ResponseBody>(
  url: string,
  method: 'GET' | 'POST',
  body?: object
): Promise<ResponseBody | undefined> {
  try {
    const res = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      console.error(data.message);
      return undefined;
    }
  } catch (e) {
    throw new Error('Noe gikk galt.');
  }
}

export function hentAlleSaker() {
  return fetcher<SaksInfo[]>('http://localhost:3000/api/sak/alle', 'GET');
}

export function hentSak(saksnummer: string) {
  return fetcher<UtvidetSaksInfo>(`http://localhost:3000/api/sak/hent/${saksnummer}`, 'GET');
}

export function finnSak(ident: string) {
  return fetcher<SaksInfo[]>('http://localhost:3000/api/sak/finn', 'POST', {
    ident: ident,
  });
}

export function hentBehandling(referanse: string) {
  return fetcher<BehandlingsInfo>(`http://localhost:3000/api/behandling/hent/${referanse}`, 'GET');
}

export function opprettSak(sak: OpprettTestcase) {
  return fetcher('http://localhost:3000/api/test/opprett', 'POST', sak);
}
