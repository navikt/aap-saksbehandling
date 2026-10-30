import { forhåndsvisDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { ForhåndsvisDialogmelding } from 'lib/types/types';

export async function POST(req: NextRequest) {
  const body = await readRequestBody<ForhåndsvisDialogmelding>(req);

  const res = await forhåndsvisDialogmelding(body);

  return NextResponse.json(res, { status: res.status });
}
