import { logError } from 'lib/serverutlis/logger';
import { purrPåLegeerklæring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isLocal } from 'lib/utils/environment';
import { NextRequest, NextResponse } from 'next/server';
import { ApiException, ErrorResponseBody, isError } from 'lib/utils/api';

const lokalFakePurringAvDokumenter = isLocal();
export async function POST(req: NextRequest) {
  if (lokalFakePurringAvDokumenter) {
    return NextResponse.json({ message: 'ok' }, { status: 200 });
  }
  try {
    const body = await req.json();
    const res = await purrPåLegeerklæring(body);
    if (isError(res)) {
      logError(`/dokumentinnhenting/purring ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/dokumentinnhenting/purring`, error);
    const err: ErrorResponseBody<ApiException> = {
      type: 'ERROR',
      status: 500,
      apiException: { message: 'Nettverksfeil', code: 'INTERNFEIL' },
    };
    return NextResponse.json(err, { status: 500 });
  }
}
