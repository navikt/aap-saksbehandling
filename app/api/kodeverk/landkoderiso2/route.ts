import { NextResponse } from 'next/server';
import { isLocal } from 'lib/utils/environment';
import { mockResponseKodeverkLandkoderIso2 } from 'lib/test/local/mockResponseKodeverkLandkoderIso2';
import { hentLandkoderIso2Kodeverk } from 'lib/services/kodeverkservice/kodeverkService';
import { logError } from 'lib/serverutlis/logger';
import { isServerError } from 'lib/utils/api';

export async function GET() {
  if (isLocal()) {
    return NextResponse.json(
      {
        type: 'SUCCESS',
        status: 200,
        data: mockResponseKodeverkLandkoderIso2,
      },
      { status: 200 }
    );
  }

  const res = await hentLandkoderIso2Kodeverk();

  if (isServerError(res)) {
    logError(`/api/kodeverk/landkoderiso2 ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    return NextResponse.json(res, { status: res.status });
  }

  return NextResponse.json(res, { status: res.status ?? 200 });
}
