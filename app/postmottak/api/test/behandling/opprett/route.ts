import { logError } from 'lib/serverutlis/logger';
import { opprettBehandlingForJournalpost } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await opprettBehandlingForJournalpost(body);
    if (isError(res) && res.status >= 500) {
      logError(`/postmottak/api/test/opprett ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('/api/test/opprett', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
