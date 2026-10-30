import { leggTilDummyYrkesskade } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { LeggTilYrkesskadeRequest } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const body = await readRequestBody<LeggTilYrkesskadeRequest>(req);

  const res = await leggTilDummyYrkesskade(params.saksnummer, body);

  return NextResponse.json(res, { status: res.status });
}
