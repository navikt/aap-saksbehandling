import { leggTilDummyInst } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const body = await req.json();

  const res = await leggTilDummyInst(params.saksnummer, body);

  return NextResponse.json(res, { status: res.status });
}
