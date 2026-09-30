import { logError } from 'lib/serverutlis/logger';
import { gjenopptaPåminnelsePåLegeerklæring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isLocal } from 'lib/utils/environment';
import { NextRequest, NextResponse } from 'next/server';
import { ApiException, ErrorResponseBody, isError } from 'lib/utils/api';

const lokalFakePåminnelseForDokumenter = isLocal();
export async function POST(req: NextRequest) {
  if (lokalFakePåminnelseForDokumenter) {
    return NextResponse.json({ message: 'ok' }, { status: 200 });
  }
  try {
    const body = await req.json();
    const res = await gjenopptaPåminnelsePåLegeerklæring(body);
    if (isError(res) && res.status !== 403) {
      logError(
        `/dokumentinnhenting/paaminnelse/gjenoppta ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
      );
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError(`/dokumentinnhenting/paaminnelse/gjenoppta`, error);
    const err: ErrorResponseBody<ApiException> = {
      type: 'ERROR',
      status: 500,
      apiException: { message: 'Nettverksfeil', code: 'INTERNFEIL' },
    };
    return NextResponse.json(err, { status: 500 });
  }
}
