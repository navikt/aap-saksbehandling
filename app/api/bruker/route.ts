import { BrukerInformasjon, hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { FetchResponse } from 'lib/utils/api';

export async function GET() {
  const brukerInformasjon = await hentBrukerInformasjon();

  const res: FetchResponse<BrukerInformasjon> = {
    data: brukerInformasjon,
    type: 'SUCCESS',
  };

  return new Response(JSON.stringify(res), { status: 200 });
}
