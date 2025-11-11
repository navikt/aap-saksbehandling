import { forhåndsvisDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await forhåndsvisDialogmelding(body);
  if (isError(res)) {
    logError('Forhåndsvisning av dialogmelding feilet', res.apiException.message);
  }
  return NextResponse.json(res, { status: res.status });
}
