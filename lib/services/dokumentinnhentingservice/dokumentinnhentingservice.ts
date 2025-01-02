import { RelevantDokumentType } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { fetchProxy } from 'lib/services/fetchProxy';

const dokumentinnhentingApiBaseUrl = 'http://dokumentinnhenting';
const dokumentinnhentingApiScope = 'api://dev-gcp.aap.dokumentinnhenting/.default';

export async function hentRelevanteDokumenter(saksnummer: string) {
  const url = `${dokumentinnhentingApiBaseUrl}/saf`;
  return await fetchProxy<RelevantDokumentType[]>(url, dokumentinnhentingApiScope, 'POST', { saksnummer: saksnummer });
}
