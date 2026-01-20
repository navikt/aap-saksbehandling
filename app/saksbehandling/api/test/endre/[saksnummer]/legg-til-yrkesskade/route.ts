import { leggTilDummyYrkesskade } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;

  const res = await leggTilDummyYrkesskade(params.saksnummer);

  return NextResponse.json(res, { status: res.status });
}
