import { logError } from 'lib/serverutlis/logger';
import { opprettBehandlingForJournalpost } from 'lib/services/postmottakservice/postmottakservice';
import { isServerError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { OpprettPostmottakBehandlingRequest } from 'lib/types/postmottakTypes';

export async function POST(req: NextRequest) {
  const body = await readRequestBody<OpprettPostmottakBehandlingRequest>(req);
  try {
    const res = await opprettBehandlingForJournalpost(body);
    if (isServerError(res)) {
      logError(`/postmottak/api/test/opprett ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('/api/test/opprett', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
