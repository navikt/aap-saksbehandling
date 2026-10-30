import { migrerArenasak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { MigrerArenaSakRequest } from 'lib/types/types';

export async function POST(req: Request) {
  const { saksnummerArena, ident } = await readRequestBody<MigrerArenaSakRequest>(req);
  const res = await migrerArenasak(saksnummerArena, ident);

  if (res.type === 'ERROR') {
    return NextResponse.json(res.apiException, { status: res.status });
  }

  return NextResponse.json(res.data, { status: res.status ?? 200 });
}
