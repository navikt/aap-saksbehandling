import { mellomlagreBrev } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;
  const body = await req.json();
  try {
    const res = await mellomlagreBrev(params.brevbestillingReferanse, body);
    if (isError(res)) {
      logError(
        `/api/brev/brevbestillingsreferanse/oppdater ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
      );
    }

    return new Response(JSON.stringify(res), { status: res.status });
  } catch (error) {
    logError('Feil i mellomlagring av brev', error);
    return new Response(
      JSON.stringify({ type: 'ERROR', apiException: { message: 'nettverksfeil', code: 'INTERNFEIL_NETTVERK' } }),
      { status: 500 }
    );
  }
}
