import {løsAvklaringsbehov} from 'lib/services/postmottakservice/postmottakservice';
import {NextRequest} from 'next/server';
import {logInfo, logWarning} from 'lib/serverutlis/logger';
import {isError} from 'lib/utils/api';
import {getErrorMessage} from 'lib/utils/errorUtil';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const løsbehovRes = await løsAvklaringsbehov(body);

    if (isError(løsbehovRes)) {
      /* Dette er et strukturert error-objekt som er konstruert av behandlingsflyt.
       * Behandlingsflyt vil alltid ta en vurdering om det trengs å logge en error.
       * Så hvis det er behov for å logge error, så har behandlingsflyt logget error.
       * Derfor er det alltid tilstrekkelig å logge det som info her.
       */
      logInfo(
        `/postmottak/løs-behov, behovstype: ${body.behov?.behovstype}, message: ${løsbehovRes.apiException.message}`
      );
    }
    return new Response(JSON.stringify(løsbehovRes), {status: løsbehovRes.status});
  } catch (error) {
    logWarning(`/løs-behov ${body.behov?.behovstype}`, error);
    return new Response(JSON.stringify({message: getErrorMessage(error)}), {status: 500});
  }
}