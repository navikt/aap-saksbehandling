import { logError } from 'lib/serverutlis/logger';
import { purrPåLegeerklæring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isLocal } from 'lib/utils/environment';
import { NextRequest } from 'next/server';
import { ApiException, ErrorResponseBody, isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  if (isLocal()) {
    return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
  }
  try {
    const body = await req.json();
    const res = await purrPåLegeerklæring(body);
    if (isError(res)) {
      logError(`/dokumentinnhenting/purring ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    }
    return new Response(JSON.stringify(res), { status: res.status });
  } catch (error) {
    logError(`/dokumentinnhenting/purring`, error);
    const err: ErrorResponseBody<ApiException> = {
      type: 'ERROR',
      status: 500,
      apiException: { message: 'Nettverksfeil', code: 'INTERNFEIL' },
    };
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
