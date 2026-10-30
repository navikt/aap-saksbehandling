import { logError } from 'lib/serverutlis/logger';
import { mellomlagreBrev } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { Brev } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;
  const body = await readRequestBody<Brev>(req);
  try {
    const res = await mellomlagreBrev(params.brevbestillingReferanse, body);
    if (isServerError(res)) {
      logError(
        `/api/brev/brevbestillingsreferanse/oppdater ${res.status} ${res.apiException.code}: ${res.apiException.message}`
      );
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('Feil i mellomlagring av brev', error);
    return new Response(
      JSON.stringify({ type: 'ERROR', apiException: { message: 'nettverksfeil', code: 'INTERNFEIL_NETTVERK' } }),
      { status: 500 }
    );
  }
}
