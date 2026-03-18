import { hentBekreftVurderingerOppfølgingGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const params = await props.params;
  const res = await hentBekreftVurderingerOppfølgingGrunnlag(params.behandlingsreferanse);
  if (isError(res)) {
    logError(
      `/grunnlag/${params.behandlingsreferanse}/grunnlag/bekreftvurderinger - ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return NextResponse.json(res, { status: res.status });
}
