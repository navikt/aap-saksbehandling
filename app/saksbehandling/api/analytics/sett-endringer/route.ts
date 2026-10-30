import { NextRequest } from 'next/server';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { logWarning } from 'lib/serverutlis/logger';
import { hentEndringslogg } from 'lib/services/endringsloggservice/endringsloggService';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';

export async function POST(req: NextRequest) {
  const body = await readRequestBody<Parameters<typeof hentEndringslogg>[0]>(req);

  try {
    const path = req.url.split('/api')[1].slice(0, -1);
    const endringsloggResponse = await hentEndringslogg(body, path);

    return new Response(JSON.stringify({}), { status: endringsloggResponse.status });
  } catch (error) {
    logWarning('/analytics/sett-endringer', error);
    return new Response(JSON.stringify({ message: getErrorMessage(error) }), { status: 500 });
  }
}
