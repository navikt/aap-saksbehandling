import { LøsAvklaringsbehovPåBehandling, OpprettTestcase, SaksInfo } from './types/types';
import { Brevmal } from 'lib/utils/sanity';

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

export function finnSak(ident: string) {
  return fetcher<SaksInfo[]>('http://localhost:3000/api/sak/finn', 'POST', {
    ident: ident,
  });
}

export function opprettSak(sak: OpprettTestcase) {
  return fetcher('/api/test/opprett', 'POST', sak);
}

export function hentAlleSaker() {
  return fetcher<SaksInfo[]>('/api/sak/alle', 'GET');
}

export function løsBehov(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return fetcher('/api/behandling/los-behov/', 'POST', avklaringsBehov);
}

export function hentBrevmalFraSanity(brevmalid: string) {
  return fetcher<Brevmal>(`/api/sanity/brevmal/${brevmalid}`, 'GET');
}

export async function hentSaksinfo() {
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

export async function hentAldersvurdering() {
  return {
    detaljer: {
      name: 'Fødselsdato',
      value: '12.12.2020 (18 år)',
    },
    saksopplysninger: [{ kilde: 'Digital søknad', dato: '10.10.2023' }],
    behandlingsform: 'AUTOMATISK',
  };
}
