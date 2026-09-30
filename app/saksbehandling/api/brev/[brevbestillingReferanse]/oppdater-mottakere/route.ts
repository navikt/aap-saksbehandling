import { logError } from 'lib/serverutlis/logger';
import { oppdaterMottakere } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;
  const body = await req.json();
  try {
    const res = await oppdaterMottakere(params.brevbestillingReferanse, body.mottaker, body.kopimottaker);
    if (isServerError(res)) {
      logError(
        `/api/brev/${params.brevbestillingReferanse}/mottakere ${res.status} ${res.apiException.code}: ${res.apiException.message}`
      );
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('Feil ved oppdatering av mottakere', error);
    return new Response(
      JSON.stringify({ type: 'ERROR', apiException: { message: 'nettverksfeil', code: 'INTERNFEIL_NETTVERK' } }),
      { status: 500 }
    );
  }
}
