import { migrerArenasak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { saksnummerArena, ident }: { saksnummerArena: string; ident: string } = await req.json();
  const res = await migrerArenasak(saksnummerArena, ident);

  if (res.type === 'ERROR') {
    return NextResponse.json(res.apiException, { status: res.status });
  }

  return NextResponse.json(res.data, { status: res.status ?? 200 });
}
