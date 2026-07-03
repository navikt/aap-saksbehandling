import { NextResponse } from 'next/server';
import { migrerArenasak } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function POST(req: Request) {
  const { saksnummer, ident }: { saksnummer: string; ident: string } = await req.json();
  const res = await migrerArenasak(saksnummer, ident);

  if (res.type === 'ERROR') {
    return NextResponse.json(res.apiException, { status: res.status });
  }

  return NextResponse.json(res.data, { status: res.status ?? 200 });
}
