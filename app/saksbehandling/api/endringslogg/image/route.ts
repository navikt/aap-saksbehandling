import { NextRequest } from 'next/server';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { logWarning } from 'lib/serverutlis/logger';
import { hentEndringslogg } from 'lib/services/endringsloggservice/endringsloggService';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const path = req.url.split('/api')[1].slice(0, -1);
    const endringsloggResponse = await hentEndringslogg(body, path);
    const r = await endringsloggResponse.json();

    return new Response(JSON.stringify(r), { status: 200 });
  } catch (error) {
    logWarning(`/endringslogg ${body.behov?.behovstype}`, error);
    return new Response(JSON.stringify({ message: getErrorMessage(error) }), { status: 500 });
  }
}
