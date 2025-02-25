import { løsAvklaringsbehov } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const løsbehovRes = await løsAvklaringsbehov(body);

    return new Response(JSON.stringify(løsbehovRes), { status: løsbehovRes.status });
  } catch (error) {
    logError('/løs-behov', error);
    return new Response(JSON.stringify({ message: getErrorMessage(error) }), { status: 500 });
  }
}
