import { logError } from '@navikt/aap-felles-utils';
import { bestillDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Bestill en dialogmelding!');
  console.log(body);
  try {
    const res = await bestillDialogmelding(body);
    return new Response(JSON.stringify({ response: res }), { status: 200 });
  } catch (error) {
    logError('Feil ved bestilling av dialogmelding', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
