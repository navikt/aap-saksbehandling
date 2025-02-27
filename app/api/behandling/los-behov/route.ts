import { løsAvklaringsbehov } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const løsbehovRes = await løsAvklaringsbehov(body);

    if (løsbehovRes.type === 'ERROR') {
      logError(`/løs-behov, behovstype: ${body.behov?.behovstype}, message: ${løsbehovRes.message}`);
    }
    return new Response(JSON.stringify(løsbehovRes), { status: løsbehovRes.status });
  } catch (error) {
    logError(`/løs-behov ${body.behov?.behovstype}`, error);
    return new Response(JSON.stringify({ message: getErrorMessage(error) }), { status: 500 });
  }
}
