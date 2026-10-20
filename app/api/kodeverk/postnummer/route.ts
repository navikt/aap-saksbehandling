import { NextResponse } from 'next/server';
import { isLocal } from 'lib/utils/environment';
import { mockResponseKodeverkPostnummer } from 'lib/test/local/mockResponseKodeverkPostnummer';
import { hentPostnummerKodeverk } from 'lib/services/kodeverkservice/kodeverkService';
import { logError } from 'lib/serverutlis/logger';
import { isServerError } from 'lib/utils/api';

export async function GET() {
  if (isLocal()) {
    return NextResponse.json(mockResponseKodeverkPostnummer, { status: 200 });
  }

  const res = await hentPostnummerKodeverk();

  if (isServerError(res)) {
    logError(`/api/kodeverk/postnummer ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    return NextResponse.json(res.apiException, { status: res.status });
  }

  return NextResponse.json(res.data, { status: res.status });
}
