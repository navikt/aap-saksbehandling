import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import {
  BehandlingFlytOgTilstand,
  BehandlingsFlytAvklaringsbehovKode,
  BestillLegeerklæring,
  Brev,
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
import { getErrorMessage } from 'lib/utils/errorUtil';
import { ClientConfig } from 'lib/types/clientConfig';
import { FetchResponse } from 'lib/utils/api';
import { TilgangResponse } from 'lib/services/tilgangservice/tilgangsService';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';

const BASE_URL = '/saksbehandling';

export async function clientFetch<ResponseBody>(
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

export function clientSøkPåBehandler(fritekst: string, saksnummer: string) {
  return clientFetch<Behandler[]>(`${BASE_URL}/api/dokumentinnhenting/behandleroppslag`, 'POST', {
    fritekst: fritekst,
    saksnummer: saksnummer,
  });
}

export function clientHentFlyt(behandlingsreferanse: string) {
  return clientFetch<BehandlingFlytOgTilstand>(`${BASE_URL}/api/behandling/${behandlingsreferanse}/flyt`, 'GET');
}

export function clientHentAlleDialogmeldingerPåSak(saksnummer: string) {
  return clientFetch<LegeerklæringStatus[]>(`${BASE_URL}/api/dokumentinnhenting/status/${saksnummer}`, 'GET');
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

export function clientBestillTestBrev(behandlingReferanse: string) {
  return clientFetch(`${BASE_URL}/api/test/bestill/brev`, 'POST', { behandlingReferanse });
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
  return clientFetch<TilgangResponse>(`${BASE_URL}/api/behandling/${behandlingsreferanse}/sjekk-tilgang`, 'POST', {
    kode: behovsKode,
  });
}

export async function clientHentBrukerInformasjon() {
  return clientFetch<BrukerInformasjon>('/api/bruker', 'GET');
}
