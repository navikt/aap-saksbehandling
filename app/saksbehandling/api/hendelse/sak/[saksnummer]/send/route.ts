import { logError } from 'lib/serverutlis/logger';
import { sendLokalHendelse } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const body = await req.json();

  const res = await sendLokalHendelse((await props.params).saksnummer, body);

  if (isServerError(res)) {
    logError('Feil oppsto ved sending av hendelse', res.apiException.message);
  }

  return NextResponse.json(res, { status: res.status });
}
