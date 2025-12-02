import { logError } from 'lib/serverutlis/logger';
import { oppdaterBrevdata } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;
  const body = await req.json();

  try {
    const res = await oppdaterBrevdata(params.brevbestillingReferanse, body);
    if (isError(res)) {
      logError(
        `/api/brev/brevbestillingsreferanse/oppdater-brevdata ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
      );
    }

    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('Feil ved oppdatering av brevdata', error);
    return new Response(
      JSON.stringify({ type: 'ERROR', apiException: { message: 'nettverksfeil', code: 'INTERNFEIL_NETTVERK' } }),
      { status: 500 }
    );
  }
}
