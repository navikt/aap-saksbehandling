import { logError } from '@navikt/aap-felles-utils';
import { mellomlagreBrev } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { brevbestillingReferanse: string } }) {
  const body = await req.json();
  try {
    const res = await mellomlagreBrev(params.brevbestillingReferanse, body);

    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    logError('Feil i mellomlagring av brev', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
