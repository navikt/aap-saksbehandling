import 'server-only';

import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { KnyttTilAnnenSakResponse } from 'components/saksoversikt/dokumentoversikt/KnyttTilSakModal';
import { apiFetch, apiFetchPdf } from 'lib/services/apiFetch';
import { HentUtsendingsinfoResponse, Journalpost } from 'lib/types/journalpost';
import {
  BehandleroppslagRequest,
  HentDokumenterPåBrukerRequest,
  HentHelsedokumenterPåBrukerRequest,
  KnyttTilAnnenSakRequest,
  LegeerklæringStatus,
} from 'lib/types/types';

const dokumentinnhentingApiBaseUrl = process.env.DOKUMENTINNHENTING_API_BASE_URL;
const dokumentinnhentingApiScope = process.env.DOKUMENTINNHENTING_API_SCOPE ?? '';

export const hentAlleDokumenterPåSak = async (saksnummer: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/sak/${saksnummer}`;
  return await apiFetch<RelevantDokumentType[]>(url, dokumentinnhentingApiScope, 'GET');
};

export const hentAlleDokumenterPåBruker = async (brukerId: HentDokumenterPåBrukerRequest) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/bruker`;
  return await apiFetch<Journalpost[]>(url, dokumentinnhentingApiScope, 'POST', brukerId);
};

export async function hentHelsedokumenterPåBruker(request: HentHelsedokumenterPåBrukerRequest) {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/bruker/helsedokumenter`;
  return await apiFetch<RelevantDokumentType[]>(url, dokumentinnhentingApiScope, 'POST', request);
}

export const hentDokument = async (journalPostId: string, dokumentInfoId: string): Promise<Response> => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalPostId}/${dokumentInfoId}`;
  return await apiFetchPdf(url, dokumentinnhentingApiScope);
};

export const hentUtsendingsinfo = async (journalPostId: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalPostId}/utsendingsinfo`;
  return await apiFetch<HentUtsendingsinfoResponse>(url, dokumentinnhentingApiScope);
};

export const knyttTilAnnenSak = async (journalpostId: string, request: KnyttTilAnnenSakRequest) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalpostId}/knyttTilAnnenSak`;

  return await apiFetch<KnyttTilAnnenSakResponse>(url, dokumentinnhentingApiScope, 'POST', request);
};

export const feilregistrerSakstilknytning = async (journalpostId: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalpostId}/feilregistrer/feilregistrerSakstilknytning`;

  return await apiFetch<void>(url, dokumentinnhentingApiScope, 'POST');
};

export const opphevFeilregistrertSakstilknytning = async (journalpostId: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalpostId}/feilregistrer/opphevFeilregistrertSakstilknytning`;

  return await apiFetch<void>(url, dokumentinnhentingApiScope, 'POST');
};

export async function hentBehandleroppslag(body: BehandleroppslagRequest) {
  const url = `${dokumentinnhentingApiBaseUrl}/syfo/behandleroppslag/search`;
  return await apiFetch<Behandler[]>(url, dokumentinnhentingApiScope, 'POST', body);
}

export const hentAlleDialogmeldingerPåSak = async (saksnummer: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/syfo/status/${saksnummer}`;
  return await apiFetch<LegeerklæringStatus[]>(url, dokumentinnhentingApiScope, 'GET');
};
