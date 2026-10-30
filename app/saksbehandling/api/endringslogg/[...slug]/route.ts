import { NextRequest } from 'next/server';
import { getErrorMessage } from 'lib/utils/errorUtil';
import { logWarning } from 'lib/serverutlis/logger';
import { hentEndringslogg } from 'lib/services/endringsloggservice/endringsloggService';
import { isLocal } from 'lib/utils/environment';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const body = await readRequestBody<Parameters<typeof hentEndringslogg>[0]>(req);

  try {
    if (isLocal()) {
      return new Response(null, { status: 200 });
    }

    const endringsloggResponse = await hentEndringslogg(body, `/endringslogg/${slug.join('/')}`);
    const r: unknown = await endringsloggResponse.json();

    return new Response(JSON.stringify(r), { status: 200 });
  } catch (error) {
    logWarning(`/endringslogg/${slug.join('/')}`, error);
    return new Response(JSON.stringify({ message: getErrorMessage(error) }), { status: 500 });
  }
}
