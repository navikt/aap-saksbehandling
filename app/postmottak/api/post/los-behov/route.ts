import { løsAvklaringsbehov } from 'lib/services/postmottakservice/postmottakservice';
import { NextRequest } from 'next/server';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { getErrorMessage } from 'lib/utils/errorUtil';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const løsbehovRes = await løsAvklaringsbehov(body);

    if (isError(løsbehovRes)) {
      logError(
        `/postmottak/løs-behov, behovstype: ${body.behov?.behovstype}, message: ${løsbehovRes.apiException.message}`
      );
    }
    return new Response(JSON.stringify(løsbehovRes), { status: løsbehovRes.status });
  } catch (error) {
    logWarning(`/løs-behov ${body.behov?.behovstype}`, error);
    return new Response(JSON.stringify({ message: getErrorMessage(error) }), { status: 500 });
  }
}
