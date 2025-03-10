import { opprettTestSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    await opprettTestSak(body);
  } catch (err: unknown) {
    logError('/test/opprett/', err);
    return new Response(JSON.stringify({ message: err?.toString() }), { status: 500 });
  }
  revalidatePath('/saksoversikt', 'page');
  return new Response(JSON.stringify({ message: 'Sak opprettet' }), { status: 200 });
}
