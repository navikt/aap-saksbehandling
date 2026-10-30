import { bestillDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { BestillLegeerklæring } from 'lib/types/types';

export async function POST(req: NextRequest) {
  const body = await readRequestBody<BestillLegeerklæring>(req);

  const res = await bestillDialogmelding(body);

  return NextResponse.json(res, { status: 200 });
}
