import { NextRequest, NextResponse } from 'next/server';
import { hentRettighetsdata } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const httpNoContent = 204;
  const params = await props.params;
  const respons = await hentRettighetsdata(params.saksnummer);

  if (isError(respons)) {
    logError(`/api/sak/${params.saksnummer}/rettighet`, respons.apiException);
    return;
  }

  if (respons.status === httpNoContent) {
    return new NextResponse(null, { status: httpNoContent });
  }
  return NextResponse.json(respons, { status: respons.status });
}
