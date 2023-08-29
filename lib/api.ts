import { BehandlingsInfo, OpprettTestcase, SaksInfo, UtvidetSaksInfo } from './types/types';

async function fetcher<ResponseBody>(
  url: string,
  method: 'GET' | 'POST',
  body?: object
): Promise<ResponseBody | undefined> {
  try {
    const res = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      return await res.json();
    } else {
      console.error('Noe gikk galt i try');
      return undefined;
    }
  } catch (e) {
    throw new Error('Noe gikk galt i catch');
  }
}

export function hentAlleSaker() {
  return fetcher<SaksInfo[]>('http://localhost:3000/api/sak/alle', 'GET');
}

// /api/sak/hent/{saksnummer}
export function hentSak(saksnummer: string) {
  return fetcher<UtvidetSaksInfo>(`http://localhost:3000/api/sak/hent/${saksnummer}`, 'GET');
}

// /api/sak/finn
export function finnSak(ident: string) {
  return fetcher<SaksInfo[]>('http://localhost:3000/api/sak/finn', 'POST', {
    ident: ident,
  });
}

// /api/behandling/hent/{referanse}
export function hentBehandling(referanse: string) {
  return fetcher<BehandlingsInfo>(`http://localhost:8080/api/behandling/hent/${referanse}`, 'GET');
}

// /test/opprett
export function opprettSak(sak: OpprettTestcase) {
  return fetcher('http://localhost:8080/test/opprett', 'POST', sak);
}
