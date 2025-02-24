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

const BASE_URL = '/saksbehandling';

async function clientFetch<ResponseBody>(
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    throw new Error('Noe gikk galt.');
  }
}

export function clientSettBehandlingPåVent(referanse: string, settPåVent: SettPåVent) {
  return clientFetch(`${BASE_URL}/api/behandling/${referanse}/sett-paa-vent`, 'POST', settPåVent);
}

export function clientOpprettSak(sak: OpprettTestcase) {
  return clientFetch(`${BASE_URL}/api/test/opprett`, 'POST', sak);
}

export function clientHentAlleSaker() {
  return clientFetch<SaksInfo[]>(`${BASE_URL}/api/sak/alle`, 'GET');
}

export function clientLøsBehov(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return clientFetch(`${BASE_URL}/api/behandling/los-behov/`, 'POST', avklaringsBehov);
}

export function clientOpprettAktivitetspliktBrudd(saksnummer: string, aktivitet: OpprettAktivitetspliktBrudd) {
  return clientFetch(`${BASE_URL}/api/sak/${saksnummer}/aktivitetsplikt/opprett`, 'POST', aktivitet);
}

export function clientOppdaterAktivitetspliktBrudd(saksnummer: string, aktivitet: OppdaterAktivitetspliktBrudd2) {
  return clientFetch(`${BASE_URL}/api/sak/${saksnummer}/aktivitetsplikt/oppdater`, 'POST', aktivitet);
}

export function clientSimulerMeldeplikt(referanse: string, vurderinger: SimulerMeldeplikt) {
  return clientFetch(`${BASE_URL}/api/behandling/${referanse}/simuler-meldeplikt`, 'POST', vurderinger);
}

export function clientSøkPåBehandler(fritekst: string) {
  return clientFetch<Behandler[]>(`${BASE_URL}/api/dokumentinnhenting/behandleroppslag`, 'POST', { fritekst });
}

export function clientHentAlleDialogmeldingerPåSak(saksnummer: string) {
  return clientFetch<LegeerklæringStatus[]>(`${BASE_URL}/api/dokumentinnhenting/status/${saksnummer}`, 'GET');
}

export function clientHentAlleDokumenterPåSak(saksnummer: string) {
  return clientFetch<DokumentInfo[]>(`${BASE_URL}/api/sak/${saksnummer}/dokumenter`, 'GET');
}

export function clientBestillDialogmelding(bestilling: BestillLegeerklæring) {
  return clientFetch(`${BASE_URL}/api/dokumentinnhenting/bestill`, 'POST', bestilling);
}

export function clientForhåndsvisDialogmelding(dialogmelding: ForhåndsvisDialogmelding) {
  return clientFetch<ForhåndsvisDialogmeldingResponse>(
    `${BASE_URL}/api/dokumentinnhenting/forhaandsvis`,
    'POST',
    dialogmelding
  );
}

export function clientMellomlagreBrev(brevbestillingReferanse: string, brev: Brev) {
  return clientFetch(`${BASE_URL}/api/brev/${brevbestillingReferanse}/oppdater`, 'POST', brev);
}

export function clientHentRelevanteDokumenter(saksnummer: string) {
  return clientFetch<RelevantDokumentType[]>(`${BASE_URL}/api/dokumentinnhenting/saf/${saksnummer}`, 'POST');
}

export function clientPurrPåLegeerklæring(dialogmeldingUUID: string) {
  return clientFetch(`${BASE_URL}/api/dokumentinnhenting/purring/${dialogmeldingUUID}`, 'POST');
}
