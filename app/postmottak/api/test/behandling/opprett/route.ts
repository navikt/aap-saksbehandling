import { opprettBehandlingForJournalpost } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { NextRequest } from 'next/server';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await opprettBehandlingForJournalpost(body);
    return new Response(JSON.stringify({ message: `Behandling opprettet` }), { status: 200 });
  } catch (error) {
    logError('/api/test/opprett', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
