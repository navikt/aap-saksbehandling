import { leggTilDummyKravVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { LeggTilKravVurderingRequest } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const body = await readRequestBody<LeggTilKravVurderingRequest>(req);

  const res = await leggTilDummyKravVurdering(params.saksnummer, body);

  return NextResponse.json(res, { status: res.status });
}
