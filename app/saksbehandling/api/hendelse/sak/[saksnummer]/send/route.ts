import { logError } from 'lib/serverutlis/logger';
import { sendLokalHendelse } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { SendHendelseRequest } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const body = await readRequestBody<SendHendelseRequest>(req);

  const res = await sendLokalHendelse((await props.params).saksnummer, body);

  if (isServerError(res)) {
    logError('Feil oppsto ved sending av hendelse', res.apiException.message);
  }

  return NextResponse.json(res, { status: res.status });
}
