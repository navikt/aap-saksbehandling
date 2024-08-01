import {
  AktivitetInnsendingDto,
  LøsAvklaringsbehovPåBehandling,
  OpprettTestcase,
  SaksInfo,
  SettPåVent,
} from './types/types';
import { Brevmal } from 'lib/utils/sanity';

async function fetchProxy<ResponseBody>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
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

export function settBehandlingPåVent(referanse: string, settPåVent: SettPåVent) {
  return fetchProxy(`/api/behandling/${referanse}/sett-paa-vent`, 'POST', settPåVent);
}

export function opprettSak(sak: OpprettTestcase) {
  return fetchProxy('/api/test/opprett', 'POST', sak);
}

export function hentAlleSaker() {
  return fetchProxy<SaksInfo[]>('/api/sak/alle', 'GET');
}

export function løsBehov(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return fetchProxy('/api/behandling/los-behov/', 'POST', avklaringsBehov);
}

export function hentBrevmalFraSanity(brevmalid: string) {
  return fetchProxy<Brevmal>(`/api/sanity/brevmal/${brevmalid}`, 'GET');
}

export function sendAktivitetClient(aktivitet: AktivitetInnsendingDto) {
  return fetchProxy('/api/hammer/send/', 'POST', aktivitet);
}
export function rekjørJobb(jobbId: number) {
  return fetch(`/api/drift/jobb/rekjor/${jobbId}`, { method: 'GET' });
}
export function rekjørFeiledeJobber() {
  return fetch('/api/drift/jobb/rekjorfeilede', { method: 'GET' });
}

export interface SaksInformasjon {
  søker: {
    navn: string;
    fnr: string;
  };
  labels: { type: string }[];
  sistEndret: {
    navn: string;
    tidspunkt: string;
  };
}
export async function hentSaksinfo(): Promise<SaksInformasjon> {
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
