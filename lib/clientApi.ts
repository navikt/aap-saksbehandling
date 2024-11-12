import { BehandleroppslagResponse } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import {
  OpprettAktivitetspliktBrudd,
  LøsAvklaringsbehovPåBehandling,
  OpprettTestcase,
  SaksInfo,
  SettPåVent,
  SimulerMeldeplikt,
  OppdaterAktivitetspliktBrudd,
  FeilregistrerAktivitetspliktBrudd,
  DokumentInfo,
} from './types/types';

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

export function opprettAktivitetspliktBrudd(saksnummer: string, aktivitet: OpprettAktivitetspliktBrudd) {
  return fetchProxy(`/api/aktivitetsplikt/${saksnummer}/opprett`, 'POST', aktivitet);
}

export function oppdaterAktivitetspliktBrudd(saksnummer: string, aktivitet: OppdaterAktivitetspliktBrudd) {
  return fetchProxy(`/api/aktivitetsplikt/${saksnummer}/oppdater`, 'POST', aktivitet);
}

export function feilregistrerAktivitetspliktBrudd(saksnummer: string, aktivitet: FeilregistrerAktivitetspliktBrudd) {
  return fetchProxy(`/api/aktivitetsplikt/${saksnummer}/feilregistrer`, 'POST', aktivitet);
}

export function simulerMeldeplikt(referanse: string, vurderinger: SimulerMeldeplikt) {
  return fetchProxy(`/api/behandling/${referanse}/simuler-meldeplikt`, 'POST', vurderinger);
}

export function søkPåBehandler(fritekst: string) {
  return fetchProxy<BehandleroppslagResponse>(`/api/dokumentinnhenting/behandleroppslag`, 'POST', { fritekst });
}

export function hentAlleDialogmeldingerPåSak(saksnummer: string) {
  return fetchProxy(`/api/dokumentinnhenting/status/${saksnummer}`, 'GET');
}

export function hentAlleDokumenterPåSak(saksnummer: string) {
  return fetchProxy<DokumentInfo[]>(`/api/sak/${saksnummer}/dokumenter`, 'GET');
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
