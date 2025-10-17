import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import {
  AktivitetspliktMedTrekkRespons,
  BehandlingFlytOgTilstand,
  BehandlingsFlytAvklaringsbehovKode,
  BehandlingsHistorikk,
  BestillLegeerklæring,
  Brev,
  ForhåndsvisDialogmelding,
  ForhåndsvisDialogmeldingResponse,
  KvalitetssikringTilgang,
  LegeerklæringStatus,
  LøsAvklaringsbehovPåBehandling,
  LøsPeriodisertBehovPåBehandling,
  MellomlagretVurderingRequest,
  MellomlagretVurderingResponse,
  NavEnheterResponse,
  NavEnhetRequest,
  OpprettAktivitetspliktBehandlingDto,
  OpprettDummySakDto,
  OpprettTestcase,
  SaksInfo,
  SettPåVent,
} from './types/types';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { ClientConfig } from 'lib/types/clientConfig';
import { FetchResponse } from 'lib/utils/api';
import { TilgangResponse } from 'lib/services/tilgangservice/tilgangsService';
import { Markering, SaksbehandlerSøkRespons, TildelOppgaveRequest } from 'lib/types/oppgaveTypes';
import { MellomLagringIdentifikator } from 'app/saksbehandling/api/mellomlagring/route';
import { isLocal } from 'lib/utils/environment';

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

export function clientHentMellomlagring(request: MellomLagringIdentifikator) {
  return clientFetch<MellomlagretVurderingResponse>(
    `${BASE_URL}/api/mellomlagring/${request.behandlingsreferanse}/${request.behovstype}`,
    'GET'
  );
}

export function clientLagreMellomlagring(request: MellomlagretVurderingRequest) {
  return clientFetch<MellomlagretVurderingResponse>(`${BASE_URL}/api/mellomlagring`, 'POST', request);
}

export function clientSlettMellomlagring(request: MellomLagringIdentifikator) {
  return clientFetch(`${BASE_URL}/api/mellomlagring`, 'DELETE', request);
}

export function clientSettBehandlingPåVent(referanse: string, settPåVent: SettPåVent) {
  return clientFetch(`${BASE_URL}/api/behandling/${referanse}/sett-paa-vent`, 'POST', settPåVent);
}

export function clientOpprettSak(sak: OpprettTestcase) {
  return clientFetch(`${BASE_URL}/api/test/opprett`, 'POST', sak);
}

export function clientOpprettOgFullfoer(sak: OpprettTestcase) {
  return clientFetch(`${BASE_URL}/api/test/opprettOgFullfoer`, 'POST', sak);
}

export function clientOpprettDummySak(sak: OpprettDummySakDto) {
  return clientFetch(`${BASE_URL}/api/test/opprettDummySak`, 'POST', sak);
}

export function clientHentAlleSaker() {
  return clientFetch<SaksInfo[]>(`${BASE_URL}/api/sak/alle`, 'GET');
}

export function clientLøsPeriodisertBehov(avklaringsBehov: LøsPeriodisertBehovPåBehandling) {
  return clientFetch(`${BASE_URL}/api/behandling/los-periodisert-behov/`, 'POST', avklaringsBehov);
}

export function clientLøsBehov(avklaringsBehov: LøsAvklaringsbehovPåBehandling) {
  return clientFetch(`${BASE_URL}/api/behandling/los-behov/`, 'POST', avklaringsBehov);
}

export function clientOpprettAktivitetsplikt(saksnummer: string, data: OpprettAktivitetspliktBehandlingDto) {
  return clientFetch(`${BASE_URL}/api/sak/${saksnummer}/opprettAktivitetspliktBehandling`, 'POST', data);
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

export function clientHentTilgangForKvalitetssikring(referanse: string) {
  return clientFetch<KvalitetssikringTilgang>(
    `${BASE_URL}/api/behandling/${referanse}/kvalitetssikring-tilgang`,
    'GET'
  );
}

export function clientHentSakshistorikk(saksnummer: string) {
  return clientFetch<Array<BehandlingsHistorikk>>(`${BASE_URL}/api/sak/${saksnummer}/historikk`, 'GET');
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

const lokalFakeUthentingAvEnheter = isLocal();
export function clientHentAlleNavenheter(behandlingReferanse: string, input: NavEnhetRequest) {
  if (lokalFakeUthentingAvEnheter) {
    const res: FetchResponse<NavEnheterResponse[]> = {
      type: 'SUCCESS',
      data: [
        {
          navn: 'Nav Løten',
          enhetsnummer: '0415',
        },
        {
          navn: 'Nav Asker',
          enhetsnummer: '0220',
        },
        {
          navn: 'Nav Grorud',
          enhetsnummer: '0328',
        },
      ],
    };

    return res;
  }

  return clientFetch<NavEnheterResponse[]>(`${BASE_URL}/api/navenhet/${behandlingReferanse}/finn`, 'POST', input);
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

export function clientSettMarkeringForBehandling(referanse: string, markering: Markering) {
  return clientFetch(`${BASE_URL}/api/behandling/${referanse}/markering/ny`, 'POST', markering);
}

export function clientFjernMarkeringForBehandling(referanse: string, markering: Markering) {
  return clientFetch(`${BASE_URL}/api/behandling/${referanse}/markering/fjern`, 'POST', markering);
}

export function clientSøkPåSaksbehandler(oppgaver: number[], søketekst: string) {
  return clientFetch<SaksbehandlerSøkRespons>(`${BASE_URL}/api/saksbehandler/finn-saksbehandler`, 'POST', {
    oppgaver: oppgaver,
    søketekst: søketekst,
  });
}

export function clientTildelTilSaksbehandler(oppgaver: number[], saksbehandlerIdent: string) {
  return clientFetch<TildelOppgaveRequest>(`${BASE_URL}/api/saksbehandler/tildel-oppgave`, 'POST', {
    oppgaver: oppgaver,
    saksbehandlerIdent: saksbehandlerIdent,
  });
}

export function clientHentAktivitetspliktMedTrekk(saksnummer: string) {
  return clientFetch<AktivitetspliktMedTrekkRespons>(`${BASE_URL}/api/aktivitetsplikt/trekk/${saksnummer}`, 'GET');
}
