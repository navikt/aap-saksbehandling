import { NextRequest } from 'next/server';
import { sendLokalHendelse } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ saksnummer: string; }> }
) {
  const body = await req.json();

  try {
    await sendLokalHendelse((await props.params).saksnummer, body);
  } catch (err) {
    logError('Feil oppsto ved sending av hendelse', err);
    return new Response(JSON.stringify({ message: 'Feil ved sending av lokal hendelse' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
