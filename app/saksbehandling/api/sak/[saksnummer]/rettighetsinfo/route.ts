import { NextRequest, NextResponse } from 'next/server';
import { hentRettighetsinfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { logError } from 'lib/serverutlis/logger';
import { RettighetsinfoDto } from 'lib/types/types';

export async function GET(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const respons = await hentRettighetsinfo(params.saksnummer);
  const httpNoContent = 204;

  if (isError(respons)) {
    logError(`/api/sak/${params.saksnummer}/rettighetsinfo`, respons.apiException);
    return;
  }

  const responsBody: RettighetsinfoDto =
    respons.status === httpNoContent
      ? { perioderMedRett: [], sisteDagMedRett: null }
      : (respons as unknown as RettighetsinfoDto);

  return NextResponse.json(responsBody, { status: respons.status });
}
