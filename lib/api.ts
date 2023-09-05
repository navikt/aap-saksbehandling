import {
  DetaljertBehandling,
  LøsAvklaringsbehovPåBehandling,
  OpprettTestcase,
  SaksInfo,
  UtvidetSaksInfo,
} from './types/types';

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
  return fetcher<DetaljertBehandling>(`http://localhost:3000/api/behandling/hent/${referanse}`, 'GET');
}

export function opprettSak(sak: OpprettTestcase) {
  return fetcher('http://localhost:3000/api/test/opprett', 'POST', sak);
}

export function løsBehov(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return fetcher('http://localhost:3000/api/behandling/los-behov', 'POST', avklaringsBehov);
}

export async function hentSaksinfo(saksnummer: string) {
  console.log('saksnummer', saksnummer);
  return {
    søker: {
      navn: 'Peder Ås',
      fnr: '123456 78910',
    },
    labels: [{ type: 'Førstegangsbehandling' }, { type: 'Fra sykepenger' }, { type: 'Lokalkontor: NAV Grünerløkka' }],
    sistEndret: {
      navn: 'Marte Kirkerud',
      tidspunkt: '12.12.2020 kl 12:12',
    },
  };
}

export async function hentAldersvurdering(saksnummer: string) {
  console.log('saksnummer', saksnummer);
  return {
    detaljer: {
      name: 'Fødselsdato',
      value: '12.12.2020 (18 år)',
    },
    saksopplysninger: [{ kilde: 'Digital søknad', dato: '10.10.2023' }],
    behandlingsform: 'AUTOMATISK',
  };
}
