import { logError } from '@navikt/aap-felles-utils';
import { forhåndsvisDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await forhåndsvisDialogmelding(body);
    return new Response(res as string, { status: 200 });
  } catch (error) {
    logError('Forhåndsvisning av dialogmelding feilet', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
