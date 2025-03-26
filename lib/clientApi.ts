import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import {
  BehandlingsFlytAvklaringsbehovKode,
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
import { FetchResponse } from 'lib/services/apiFetch';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { ClientConfig } from 'lib/types/clientConfig';

const BASE_URL = '/saksbehandling';

export async function clientFetch<ResponseBody>(
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

async function clientFetchV2<ResponseBody>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: object
): Promise<FetchResponse<ResponseBody>> {
  try {
    const res = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      return {
        type: 'SUCCESS',
        status: res.status,
        responseJson: data as ResponseBody,
      };
    } else {
      return {
        type: 'ERROR',
        status: res.status,
        message: data.message || res.statusText,
      };
    }
  } catch (e) {
    return {
      type: 'ERROR',
      message: getErrorMessage(e),
      status: 500,
    };
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
  return clientFetchV2(`${BASE_URL}/api/behandling/los-behov/`, 'POST', avklaringsBehov);
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

export function clientSøkPåBehandler(fritekst: string, saksnummer: string) {
  return clientFetch<Behandler[]>(`${BASE_URL}/api/dokumentinnhenting/behandleroppslag`, 'POST', {
    fritekst: fritekst,
    saksnummer: saksnummer,
  });
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

export function clientPurrPåLegeerklæring(dialogmeldingUUID: string, behandlingsreferanse: string) {
  return clientFetch(`${BASE_URL}/api/dokumentinnhenting/purring`, 'POST', {
    dialogmeldingPurringUUID: dialogmeldingUUID,
    behandlingsReferanse: behandlingsreferanse,
  });
}

export function clientSendHendelse(body: Object) {
  return clientFetch(`${BASE_URL}/api/hendelse/send`, 'POST', body);
}

export function clientConfig() {
  return clientFetch<ClientConfig>('/api/config', 'GET');
}

export async function clientSjekkTilgang(
  behandlingsreferanse: string,
  behovsKode: BehandlingsFlytAvklaringsbehovKode
): Promise<{ harTilgangTilNesteOppgave: boolean } | undefined> {
  return clientFetch<{ harTilgangTilNesteOppgave: boolean }>(
    `${BASE_URL}/api/behandling/${behandlingsreferanse}/sjekk-tilgang`,
    'POST',
    {
      kode: behovsKode,
    }
  );
}
