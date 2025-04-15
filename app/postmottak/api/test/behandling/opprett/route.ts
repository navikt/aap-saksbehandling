import { opprettBehandlingForJournalpost } from 'lib/services/postmottakservice/postmottakservice';
import { NextRequest } from 'next/server';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await opprettBehandlingForJournalpost(body);
    if (isError(res)) {
      logError(`/postmottak/api/test/opprett ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    }
    return new Response(JSON.stringify(res), { status: res.status });
  } catch (error) {
    logError('/api/test/opprett', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
