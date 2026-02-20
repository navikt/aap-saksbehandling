import 'server-only';

import {
  AvklarTemaGrunnlag,
  BehandlingFlytOgTilstand,
  DetaljertBehandlingDto,
  DigitaliseringsGrunnlag,
  FinnSakGrunnlag,
  FlytProsessering,
  JournalpostInfo,
  LøsAvklaringsbehovPåBehandling,
  OverleveringGrunnlag,
  SettPåVentRequest,
  Venteinformasjon,
} from 'lib/types/postmottakTypes';
import { logError, logInfo, logWarning } from 'lib/serverutlis/logger';
import { apiFetch, apiFetchPdf } from 'lib/services/apiFetch';
import { isError } from 'lib/utils/api';

const postmottakApiBaseUrl = process.env.POSTMOTTAK_API_BASE_URL;
const postmottakApiScope = process.env.POSTMOTTAK_API_SCOPE ?? '';

export const hentBehandling = async (behandlingsReferanse: string) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${behandlingsReferanse}`;
  return await apiFetch<DetaljertBehandlingDto>(url, postmottakApiScope, 'GET');
};
export const hentFlyt = async (behandlingsreferanse: string) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/flyt`;
  return await apiFetch<BehandlingFlytOgTilstand>(url, postmottakApiScope, 'GET');
};

export const hentAvklarTemaGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/avklarTemaVurdering`;
  return await apiFetch<AvklarTemaGrunnlag>(url, postmottakApiScope, 'GET');
};
export const hentFinnSakGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/finnSak`;
  return await apiFetch<FinnSakGrunnlag>(url, postmottakApiScope, 'GET');
};
export const hentOverleveringGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/overlevering`;
  return await apiFetch<OverleveringGrunnlag>(url, postmottakApiScope, 'GET');
};
export const hentDigitaliseringGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/digitalisering`;
  return await apiFetch<DigitaliseringsGrunnlag>(url, postmottakApiScope, 'GET');
};
export const hentJournalpostInfo = async (behandlingsreferanse: string) => {
  const url = `${postmottakApiBaseUrl}/api/dokumenter/${behandlingsreferanse}/info`;
  return apiFetch<JournalpostInfo>(url, postmottakApiScope, 'GET');
};

export const hentUbehandledeJournalposter = async () => {
  const url = `${postmottakApiBaseUrl}/api/dokumenter/finn-ubehandlede`;
  return await apiFetch<any[]>(url, postmottakApiScope, 'GET');
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/løs-behov`;
  return await apiFetch<void>(url, postmottakApiScope, 'POST', avklaringsBehov);
};
export const settPåVent = async (behandlingsreferanse: string, body: SettPåVentRequest) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/sett-på-vent`;
  return await apiFetch<unknown>(url, postmottakApiScope, 'POST', body, [`postmottak/flyt/${behandlingsreferanse}`]);
};
export const hentVenteInformasjon = async (behandlingsreferanse: string) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/vente-informasjon`;
  return await apiFetch<Venteinformasjon>(url, postmottakApiScope, 'GET');
};
export const hentDokumentFraDokumentInfoId = async (
  journalpostId: number,
  dokumentInfoId: string
): Promise<Response> => {
  return apiFetchPdf(`${postmottakApiBaseUrl}/api/dokumenter/${journalpostId}/${dokumentInfoId}`, postmottakApiScope);
};

export const endreTema = async (behandlingsreferanse: string) => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/endre-tema`;
  return await apiFetch<{ redirectUrl: string }>(url, postmottakApiScope, 'POST');
};

export const alleBehandlinger = async (ident: string) => {
  const url = `${postmottakApiBaseUrl}/api/alle-behandlinger`;
  const body = { ident: ident };
  return await apiFetch<{ redirectUrl: string }>(url, postmottakApiScope, 'POST', body);
};

export const hentAlleBehandlinger = async () => {
  const url = `${postmottakApiBaseUrl}/test/hentAlleBehandlinger`;
  return await apiFetch<[{ id: string; journalpostId: string; status: string; opprettet: string; steg: string }]>(
    url,
    postmottakApiScope,
    'GET'
  );
};
export const forberedBehandlingOgVentPåProsessering = async (
  referanse: string
): Promise<undefined | FlytProsessering> => {
  const url = `${postmottakApiBaseUrl}/api/behandling/${referanse}/forbered`;
  logInfo(`Forbereder behandling: ${referanse}`);
  return await apiFetch(url, postmottakApiScope, 'GET').then(() => ventTilProsesseringErFerdig(referanse));
};

export const auditlog = async (journalpostId: number) => {
  const url = `${postmottakApiBaseUrl}/api/journalpost/${journalpostId}/auditlog`;
  return await apiFetch(url, postmottakApiScope, 'POST');
};

// TODO: Fjern denne - testendepunkt
export const opprettBehandlingForJournalpost = async (body: { journalpostId: number }) => {
  const url = `${postmottakApiBaseUrl}/api/behandling`;
  return await apiFetch<{ referanse: number }>(url, postmottakApiScope, 'POST', body);
};

async function ventTilProsesseringErFerdig(
  behandlingsreferanse: string,
  maksAntallForsøk: number = 10,
  interval: number = 1000
): Promise<undefined | FlytProsessering> {
  let forsøk = 0;
  let prosessering: FlytProsessering | undefined = undefined;

  while (forsøk < maksAntallForsøk) {
    forsøk++;

    logInfo(`ventTilProsesseringErFerdig, forsøk nummer: ${forsøk}`);
    const response = await hentFlyt(behandlingsreferanse);
    if (isError(response)) {
      if (response.status === 408) {
        logWarning(`ventTilProsseseringErFerdig hentFlyt tok for lang tid: ${response.apiException.message}`);
      } else {
        logError(
          `ventTilProsseseringErFerdig hentFlyt ${response.status} - ${response.apiException.code}: ${response.apiException.message}`
        );
      }
      prosessering = { status: 'FEILET', ventendeOppgaver: [] };
      break;
    }

    const status = response.data.prosessering.status;

    if (status === 'FERDIG') {
      prosessering = undefined;
      break;
    }

    if (status === 'FEILET') {
      logError(`Prosessering feilet: ${JSON.stringify(response.data.prosessering.ventendeOppgaver)}`);
      prosessering = response.data.prosessering;
      break;
    }

    if (forsøk < maksAntallForsøk) {
      await new Promise((resolve) => setTimeout(resolve, interval * 1.3));
    }
  }

  return prosessering;
}
