import { fetchPdf, fetchProxy } from 'lib/services/fetchProxy';
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
import { logError, logInfo } from 'lib/serverutlis/logger';
import { apiFetch } from 'lib/services/apiFetch';

const dokumentMottakApiBaseUrl = process.env.DOKUMENTMOTTAK_API_BASE_URL;
const dokumentMottakApiScope = process.env.DOKUMENTMOTTAK_API_SCOPE ?? '';

export const hentBehandling = async (behandlingsReferanse: string) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${behandlingsReferanse}`;
  return await apiFetch<DetaljertBehandlingDto>(url, dokumentMottakApiScope, 'GET');
};
export const hentFlyt = async (behandlingsreferanse: string): Promise<BehandlingFlytOgTilstand> => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/flyt`;
  return await fetchProxy<BehandlingFlytOgTilstand>(url, dokumentMottakApiScope, 'GET');
};

export const hentAvklarTemaGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/avklarTemaVurdering`;
  return await apiFetch<AvklarTemaGrunnlag>(url, dokumentMottakApiScope, 'GET');
};
export const hentFinnSakGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/finnSak`;
  return await apiFetch<FinnSakGrunnlag>(url, dokumentMottakApiScope, 'GET');
};
export const hentOverleveringGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/overlevering`;
  return await apiFetch<OverleveringGrunnlag>(url, dokumentMottakApiScope, 'GET');
};
export const hentDigitaliseringGrunnlag = async (behandlingsreferanse: string) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/grunnlag/digitalisering`;
  return await apiFetch<DigitaliseringsGrunnlag>(url, dokumentMottakApiScope, 'GET');
};
export const hentJournalpostInfo = async (behandlingsreferanse: string) => {
  const url = `${dokumentMottakApiBaseUrl}/api/dokumenter/${behandlingsreferanse}/info`;
  return apiFetch<JournalpostInfo>(url, dokumentMottakApiScope, 'GET');
};

export const løsAvklaringsbehov = async (avklaringsBehov: LøsAvklaringsbehovPåBehandling) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/løs-behov`;
  return await apiFetch<void>(url, dokumentMottakApiScope, 'POST', avklaringsBehov);
};
export const settPåVent = async (behandlingsreferanse: string, body: SettPåVentRequest) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/sett-på-vent`;
  return await apiFetch<unknown>(url, dokumentMottakApiScope, 'POST', body, [
    `postmottak/flyt/${behandlingsreferanse}`,
  ]);
};
export const hentVenteInformasjon = async (behandlingsreferanse: string) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/vente-informasjon`;
  return await apiFetch<Venteinformasjon>(url, dokumentMottakApiScope, 'GET');
};
export const hentDokumentFraDokumentInfoId = async (
  journalpostId: number,
  dokumentInfoId: string
): Promise<Blob | undefined> => {
  return fetchPdf(
    `${dokumentMottakApiBaseUrl}/api/dokumenter/${journalpostId}/${dokumentInfoId}`,
    dokumentMottakApiScope
  );
};

export const endreTema = async (behandlingsreferanse: string) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${behandlingsreferanse}/endre-tema`;
  return await fetchProxy<{ redirectUrl: string }>(url, dokumentMottakApiScope, 'POST');
};

export const hentAlleBehandlinger = async () => {
  const url = `${dokumentMottakApiBaseUrl}/test/hentAlleBehandlinger`;
  return await fetchProxy<[{ id: string; status: string; opprettet: string; steg: string }]>(
    url,
    dokumentMottakApiScope,
    'GET'
  );
};
export const forberedBehandlingOgVentPåProsessering = async (
  referanse: string
): Promise<undefined | FlytProsessering> => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling/${referanse}/forbered`;
  logInfo(`Forbereder behandling: ${referanse}`);
  return await fetchProxy(url, dokumentMottakApiScope, 'GET').then(() => ventTilProsesseringErFerdig(referanse));
};

export const auditlog = async (journalpostId: number) => {
  const url = `${dokumentMottakApiBaseUrl}/api/journalpost/${journalpostId}/auditlog`;
  return await apiFetch(url, dokumentMottakApiScope, 'POST');
};

// TODO: Fjern denne - testendepunkt
export const opprettBehandlingForJournalpost = async (body: { journalpostId: number }) => {
  const url = `${dokumentMottakApiBaseUrl}/api/behandling`;
  return await fetchProxy<{ referanse: number }>(url, dokumentMottakApiScope, 'POST', body);
};

// TODO: Fjern denne - testendepunkt
export const rekjørFeiledeJobber = async () => {
  const url = `${dokumentMottakApiBaseUrl}/drift/api/jobb/rekjorAlleFeilede`;
  return await fetchProxy(url, dokumentMottakApiScope, 'GET');
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

    logInfo(`ventTilProsesseringErFerdig, orsøk nummer: ${forsøk}`);
    const response = await hentFlyt(behandlingsreferanse);

    const status = response.prosessering.status;

    if (status === 'FERDIG') {
      prosessering = undefined;
      break;
    }

    if (status === 'FEILET') {
      logError(`Prosessering feilet: ${JSON.stringify(response.prosessering.ventendeOppgaver)}`);
      prosessering = response.prosessering;
      break;
    }

    if (forsøk < maksAntallForsøk) {
      await new Promise((resolve) => setTimeout(resolve, interval * 1.3));
    }
  }

  return prosessering;
}
