import { NextRequest } from 'next/server';
import { sendLokalHendelse } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const body = await req.json();

  const res = await sendLokalHendelse((await props.params).saksnummer, body);

  if (isError(res)) {
    logError('Feil oppsto ved sending av hendelse', res.apiException.message);
  }

  return new Response(JSON.stringify(res), { status: res.status });
}
