import { NextRequest } from 'next/server';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { logWarning } from 'lib/serverutlis/logger';

/**
 * Må støtte endepunkter som POST på
 * /text
 * /image
 * /analytics/sett-endringer
 * /analytics/seen-forced-modal
 *
 * Proxy i next?
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    console.log('body: ', JSON.stringify(body));
    // const endringsloggResponse = await proxyEndringlogg(body);

    return new Response(JSON.stringify({}), { status: 200 });
  } catch (error) {
    logWarning(`/endringslogg ${body.behov?.behovstype}`, error);
    return new Response(JSON.stringify({ message: getErrorMessage(error) }), { status: 500 });
  }
}
