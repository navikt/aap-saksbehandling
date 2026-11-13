import { isLocal } from 'lib/utils/environment';
import { NextRequest, NextResponse } from 'next/server';
import { sendManuellPåminnelsePåLegeerklæring } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { ApiException, ErrorResponseBody, isError } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';

const lokalFakePåminnelserForDokumenter = isLocal();

export async function POST(req: NextRequest) {
  if (lokalFakePåminnelserForDokumenter) {
    return NextResponse.json({ message: 'ok' }, { status: 200 });
  }

  try {
    const body = await req.json();
    const res = await sendManuellPåminnelsePåLegeerklæring(body);
    if (isError(res) && res.status !== 403) {
      logError(
        `/dialogmelding/paaminnelse/v2/send${res.status} - ${res.apiException.code}: ${res.apiException.message}`
      );
    }
    return NextResponse.json(res, { status: res.status === 204 ? 200 : res.status });
  } catch (error) {
    logError('`/dialogmelding/paaminnelse/v2/send', error);
    const err: ErrorResponseBody<ApiException> = {
      type: 'ERROR',
      status: 500,
      apiException: { message: 'Nettverksfeil', code: 'INTERNFEIL' },
    };
    return NextResponse.json(err, { status: 500 });
  }
}
