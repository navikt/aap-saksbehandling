import { NextRequest } from 'next/server';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { logWarning } from 'lib/serverutlis/logger';
import { hentEndringslogg } from 'lib/services/endringsloggservice/endringsloggService';
import { isLocal } from 'lib/utils/environment';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const body = await req.json();

  try {
    if (isLocal()) {
      return new Response(null, { status: 200 });
    }

    const endringsloggResponse = await hentEndringslogg(body, `/endringslogg/${slug.join('/')}`);
    const r = await endringsloggResponse.json();

    return new Response(JSON.stringify(r), { status: 200 });
  } catch (error) {
    logWarning(`/endringslogg ${body.behov?.behovstype}`, error);
    return new Response(JSON.stringify({ message: getErrorMessage(error) }), { status: 500 });
  }
}
