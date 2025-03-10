import { løsAvklaringsbehov } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { NextRequest } from 'next/server';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    await løsAvklaringsbehov(body);

    return new Response(JSON.stringify({ message: 'Behov løst' }), { status: 200 });
  } catch (error) {
    logError('/api/post/løs-behov', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
