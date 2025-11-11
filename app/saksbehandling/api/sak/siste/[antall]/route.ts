import { hentSiste } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, props: { params: Promise<{ antall: number }> }) {
  const params = await props.params;
  const data = await hentSiste(params.antall);

  return NextResponse.json(data, { status: 200 });
}

export const dynamic = 'force-dynamic';
