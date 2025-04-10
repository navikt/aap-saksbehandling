import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import {
  BehandlingFlytOgTilstand,
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
} from './types/types';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { ClientConfig } from 'lib/types/clientConfig';
import { logError } from 'lib/serverutlis/logger';
import { FetchResponse } from 'lib/utils/api';
import { TilgangResponse } from 'lib/services/tilgangservice/tilgangsService';

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
      logError(data.message);
      return undefined;
    }
  } catch {
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

    return await res.json();
  } catch (e) {
    return {
      type: 'ERROR',
      status: 500,
      apiException: {
        message: getErrorMessage(e),
      },
    };
  }
}

export function clientSettBehandlingPåVent(referanse: string, settPåVent: SettPåVent) {
  return clientFetchV2(`${BASE_URL}/api/behandling/${referanse}/sett-paa-vent`, 'POST', settPåVent);
}

export function clientOpprettSak(sak: OpprettTestcase) {
  return clientFetchV2(`${BASE_URL}/api/test/opprett`, 'POST', sak);
}

export function clientHentAlleSaker() {
  return clientFetchV2<SaksInfo[]>(`${BASE_URL}/api/sak/alle`, 'GET');
}

export function clientLøsBehov(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return clientFetchV2(`${BASE_URL}/api/behandling/los-behov/`, 'POST', avklaringsBehov);
}

export function clientOpprettAktivitetspliktBrudd(saksnummer: string, aktivitet: OpprettAktivitetspliktBrudd) {
  return clientFetchV2(`${BASE_URL}/api/sak/${saksnummer}/aktivitetsplikt/opprett`, 'POST', aktivitet);
}

export function clientOppdaterAktivitetspliktBrudd(saksnummer: string, aktivitet: OppdaterAktivitetspliktBrudd2) {
  return clientFetchV2(`${BASE_URL}/api/sak/${saksnummer}/aktivitetsplikt/oppdater`, 'POST', aktivitet);
}

export function clientSøkPåBehandler(fritekst: string, saksnummer: string) {
  return clientFetchV2<Behandler[]>(`${BASE_URL}/api/dokumentinnhenting/behandleroppslag`, 'POST', {
    fritekst: fritekst,
    saksnummer: saksnummer,
  });
}

export function clientHentFlyt(behandlingsreferanse: string) {
  return clientFetch<BehandlingFlytOgTilstand>(`${BASE_URL}/api/behandling/${behandlingsreferanse}/flyt`, 'GET');
}

export function clientHentAlleDialogmeldingerPåSak(saksnummer: string) {
  return clientFetchV2<LegeerklæringStatus[]>(`${BASE_URL}/api/dokumentinnhenting/status/${saksnummer}`, 'GET');
}

export function clientHentAlleDokumenterPåSak(saksnummer: string) {
  return clientFetchV2<DokumentInfo[]>(`${BASE_URL}/api/sak/${saksnummer}/dokumenter`, 'GET');
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
  return clientFetchV2(`${BASE_URL}/api/brev/${brevbestillingReferanse}/oppdater`, 'POST', brev);
}

export function clientBestillTestBrev(behandlingReferanse: string) {
  return clientFetchV2(`${BASE_URL}/api/test/bestill/brev`, 'POST', { behandlingReferanse });
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

export function clientSendHendelse(saksnummer: string, body: Object) {
  return clientFetch(`${BASE_URL}/api/hendelse/sak/${saksnummer}/send`, 'POST', body);
}

export function clientConfig() {
  return clientFetch<ClientConfig>('/api/config', 'GET');
}

export async function clientSjekkTilgang(behandlingsreferanse: string, behovsKode: BehandlingsFlytAvklaringsbehovKode) {
  return clientFetchV2<TilgangResponse>(`${BASE_URL}/api/behandling/${behandlingsreferanse}/sjekk-tilgang`, 'POST', {
    kode: behovsKode,
  });
}
