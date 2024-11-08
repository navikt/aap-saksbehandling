import { logError } from '@navikt/aap-felles-utils';
import { BehandleroppslagResponse } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { fetchProxy } from 'lib/services/fetchProxy';
import { NextRequest } from 'next/server';

const dokumentinnhentingApiBaseUrl = 'http://dokumentinnhenting';
const dokumentinnhentingApiScope = 'api://dev-gcp.aap.dokumentinnhenting/.default';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const url = `${dokumentinnhentingApiBaseUrl}/syfo/behandleroppslag/search`;
    const res = await fetchProxy<BehandleroppslagResponse>(url, dokumentinnhentingApiScope, 'POST', body);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (err) {
    logError(`/dokumentinnhenting/behandleroppslag`, err);
    return new Response(JSON.stringify({ message: 'Behandleroppslag feilet' }), { status: 500 });
  }
}
