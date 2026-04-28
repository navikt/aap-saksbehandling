import { NextRequest, NextResponse } from 'next/server';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { getToken } from '@navikt/oasis';
import { headers } from 'next/headers';

export async function GET(_: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;

  if (!getToken(await headers())) {
    return NextResponse.json(
      { type: 'ERROR', apiException: { message: 'Ikke autentisert' }, status: 401 },
      { status: 401 }
    );
  }

  const res = await hentFlyt(params.referanse);
  if (isError(res)) {
    const errorMsg = `api/behandling/${params.referanse}/flyt ${res.status} - ${res.apiException.code}: ${res.apiException.message}`;

    if (res.status === 408) logWarning(errorMsg);
    else logError(errorMsg);
  }
  return NextResponse.json(res, { status: res.status });
}
export const dynamic = 'force-dynamic';
