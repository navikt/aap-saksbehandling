import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import {
  BestillLegeerklæring,
  Brev,
  DokumentInfo,
  ForhåndsvisDialogmelding,
  ForhåndsvisDialogmeldingResponse,
  LegeerklæringStatus,
  LøsAvklaringsbehovPåBehandling,
  OppdaterAktivitetspliktBrudd2,
  OpprettAktivitetspliktBrudd,
  OpprettTestcase,
  SaksInfo,
  SettPåVent,
  SimulerMeldeplikt,
} from './types/types';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';

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

export function clientSettBehandlingPåVent(referanse: string, settPåVent: SettPåVent) {
  return fetchProxy(`/api/behandling/${referanse}/sett-paa-vent`, 'POST', settPåVent);
}

export function clientOpprettSak(sak: OpprettTestcase) {
  return fetchProxy('/api/test/opprett', 'POST', sak);
}

export function clientHentAlleSaker() {
  return fetchProxy<SaksInfo[]>('/api/sak/alle', 'GET');
}

export function clientLøsBehov(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return fetchProxy('/api/behandling/los-behov/', 'POST', avklaringsBehov);
}

export function clientOpprettAktivitetspliktBrudd(saksnummer: string, aktivitet: OpprettAktivitetspliktBrudd) {
  return fetchProxy(`/api/aktivitetsplikt/${saksnummer}/opprett`, 'POST', aktivitet);
}

export function clientOppdaterAktivitetspliktBrudd(saksnummer: string, aktivitet: OppdaterAktivitetspliktBrudd2) {
  return fetchProxy(`/api/aktivitetsplikt/${saksnummer}/oppdater`, 'POST', aktivitet);
}

export function clientSimulerMeldeplikt(referanse: string, vurderinger: SimulerMeldeplikt) {
  return fetchProxy(`/api/behandling/${referanse}/simuler-meldeplikt`, 'POST', vurderinger);
}

export function clientSøkPåBehandler(fritekst: string) {
  return fetchProxy<Behandler[]>(`/api/dokumentinnhenting/behandleroppslag`, 'POST', { fritekst });
}

export function clientHentAlleDialogmeldingerPåSak(saksnummer: string) {
  return fetchProxy<LegeerklæringStatus[]>(`/api/dokumentinnhenting/status/${saksnummer}`, 'GET');
}

export function clientHentAlleDokumenterPåSak(saksnummer: string) {
  return fetchProxy<DokumentInfo[]>(`/api/sak/${saksnummer}/dokumenter`, 'GET');
}

export function clientBestillDialogmelding(bestilling: BestillLegeerklæring) {
  return fetchProxy(`/api/dokumentinnhenting/bestill`, 'POST', bestilling);
}

export function clientForhåndsvisDialogmelding(dialogmelding: ForhåndsvisDialogmelding) {
  return fetchProxy<ForhåndsvisDialogmeldingResponse>(`/api/dokumentinnhenting/forhaandsvis`, 'POST', dialogmelding);
}

export function clientMellomlagreBrev(brevbestillingReferanse: string, brev: Brev) {
  return fetchProxy(`/api/brev/${brevbestillingReferanse}/oppdater`, 'POST', brev);
}

export function clientHentRelevanteDokumenter(saksnummer: string) {
  return fetchProxy<RelevantDokumentType[]>(`/api/saf/${saksnummer}`, 'POST');
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
