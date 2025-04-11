import { Behandler } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { apiFetch } from 'lib/services/apiFetch';

const dokumentinnhentingApiBaseUrl = process.env.DOKUMENTINNHENTING_API_BASE_URL;
const dokumentinnhentingApiScope = process.env.DOKUMENTINNHENTING_API_SCOPE ?? '';

export async function hentRelevanteDokumenter(saksnummer: string) {
  const url = `${dokumentinnhentingApiBaseUrl}/saf`;
  return await apiFetch<RelevantDokumentType[]>(url, dokumentinnhentingApiScope, 'POST', { saksnummer: saksnummer });
}

export async function hentBehandleroppslag(body: object) {
  const url = `${dokumentinnhentingApiBaseUrl}/syfo/behandleroppslag/search`;
  return await apiFetch<Behandler[]>(url, dokumentinnhentingApiScope, 'POST', body);
}
