import { NextRequest, NextResponse } from 'next/server';
import { hentRettighetGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const res = await hentRettighetGrunnlag(params.saksnummer);

  if (isError(res)) {
    logError(`/api/behandling/${params.saksnummer}/rettighet`, res.apiException);
  }
  return NextResponse.json(res, { status: res.status });
}
