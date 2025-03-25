import { logError } from 'lib/serverutlis/logger';
import { bestillDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isLocal } from 'lib/utils/environment';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  if (isLocal()) {
    return new Response(JSON.stringify({ response: '1234' }), { status: 200 });
  }
  const body = await req.json();
  try {
    const res = await bestillDialogmelding(body);
    return new Response(JSON.stringify({ response: res }), { status: 200 });
  } catch (error) {
    logError('Feil ved bestilling av dialogmelding', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
