import { logError } from 'lib/serverutlis/logger';
import { isLocal } from 'lib/utils/environment';
import { NextRequest, NextResponse } from 'next/server';
import { ApiException, ErrorResponseBody, isError } from 'lib/utils/api';
import { avbrytPåminnelsePåLegeerklæring } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

const lokalFakePåminnelseForDokumenter = isLocal();
export async function POST(req: NextRequest) {
  if (lokalFakePåminnelseForDokumenter) {
    return NextResponse.json({ message: 'ok' }, { status: 200 });
  }
  try {
    const body = await req.json();
    const res = await avbrytPåminnelsePåLegeerklæring(body);
    if (isError(res) && res.status !== 403) {
      logError(
        `/dialogmelding/paaminnelse/avbryt-automatisk-paaminnelse ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
      );
    }
    return NextResponse.json(res, { status: res.status === 204 ? 200 : res.status });
  } catch (error) {
    logError(`/dialogmelding/paaminnelse/avbryt-automatisk-paaminnelse`, error);
    const err: ErrorResponseBody<ApiException> = {
      type: 'ERROR',
      status: 500,
      apiException: { message: 'Nettverksfeil', code: 'INTERNFEIL' },
    };
    return NextResponse.json(err, { status: 500 });
  }
}
