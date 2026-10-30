import { leggTilDummyInst } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { LeggTilInstitusjonsoppholdRequest } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const body = await readRequestBody<LeggTilInstitusjonsoppholdRequest>(req);

  const res = await leggTilDummyInst(params.saksnummer, body);

  return NextResponse.json(res, { status: res.status });
}
