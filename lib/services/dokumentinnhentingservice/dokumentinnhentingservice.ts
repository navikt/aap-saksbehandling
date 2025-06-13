import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { apiFetch, apiFetchPdf } from 'lib/services/apiFetch';
import { DokumentInfo, Journalpost } from 'lib/types/types';

const dokumentinnhentingApiBaseUrl = process.env.DOKUMENTINNHENTING_API_BASE_URL;
const dokumentinnhentingApiScope = process.env.DOKUMENTINNHENTING_API_SCOPE ?? '';

export const hentAlleDokumenterPåSak = async (saksnummer: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/sak/${saksnummer}`;
  return await apiFetch<DokumentInfo[]>(url, dokumentinnhentingApiScope, 'GET');
};

export async function hentHelsedokumenterPåSak(saksnummer: string) {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/sak/${saksnummer}/helsedokumenter`;
  return await apiFetch<RelevantDokumentType[]>(url, dokumentinnhentingApiScope, 'GET');
};

export const hentAlleDokumenterPåBruker = async (brukerId: any) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/bruker`;
  return await apiFetch<Journalpost[]>(url, dokumentinnhentingApiScope, 'POST', brukerId);
};

export const hentDokument = async (journalPostId: string, dokumentInfoId: string) => {
  const url = `${dokumentinnhentingApiBaseUrl}/api/dokumenter/${journalPostId}/${dokumentInfoId}`;
  return await apiFetchPdf(url, dokumentinnhentingApiScope);
};

export async function hentBehandleroppslag(body: object) {
  const url = `${dokumentinnhentingApiBaseUrl}/syfo/behandleroppslag/search`;
  return await apiFetch<Behandler[]>(url, dokumentinnhentingApiScope, 'POST', body);
};
