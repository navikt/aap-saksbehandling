import {løsAvklaringsbehov} from 'lib/services/postmottakservice/postmottakservice';
import {NextRequest} from 'next/server';
import {logError, logInfo, logWarning} from 'lib/serverutlis/logger';
import {ApiException, ErrorResponseBody, isError} from 'lib/utils/api';
import {getErrorMessage} from 'lib/utils/errorUtil';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const løsbehovRes = await løsAvklaringsbehov(body);

    if (isError(løsbehovRes)) {
      if (shouldLogError(løsbehovRes)) {
        logError(
          `/postmottak/løs-behov, behovstype: ${body.behov?.behovstype}, message: ${løsbehovRes.apiException.message}`
        );
      } else {
        logInfo(
          `/postmottak/løs-behov, behovstype: ${body.behov?.behovstype}, message: ${løsbehovRes.apiException.message}`
        );
      }
    }
    return new Response(JSON.stringify(løsbehovRes), {status: løsbehovRes.status});
  } catch (error) {
    logWarning(`/løs-behov ${body.behov?.behovstype}`, error);
    return new Response(JSON.stringify({message: getErrorMessage(error)}), {status: 500});
  }
}

const ignoreMessages = [
  /Behandlingen har blitt oppdatert. Versjonsnummer\[\d+] ulikt fra siste\[\d+]/,
  /Forsøker å løse avklaringsbehov .+\(kode='.+'\) som er definert i et steg etter nåværende steg\[.+] .+\(.+\). Skal løses i steg\[.+]/,
]
function shouldLogError(response: ErrorResponseBody<ApiException>): boolean {
  if (ignoreMessages.some(regexp => regexp.test(response.apiException.message))) {
    return false
  }
  return true
}
