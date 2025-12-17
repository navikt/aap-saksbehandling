import { logError } from 'lib/serverutlis/logger';
import { bestillDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await bestillDialogmelding(body);

  if (isError(res)) {
    logError('Feil ved bestilling av dialogmelding', res.apiException.message);
  }

  return NextResponse.json(res, { status: 200 });
}
