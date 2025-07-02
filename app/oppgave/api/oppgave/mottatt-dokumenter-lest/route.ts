import { NextRequest } from 'next/server';
import { mottattDokumenterLest } from 'lib/services/oppgaveservice/oppgaveservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  try {
    const body: { behandlingRef: string } = await req.json();
    const res = await mottattDokumenterLest(body.behandlingRef);
    if (isError(res)) {
      logError(`/oppgave/api/mottatt-dokumenter-lest`, res.apiException);
      return new Response(JSON.stringify(res), { status: 500 });
    }
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    logError('Feil ved markering av mottatt dokumenter lest', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
