import { logError } from 'lib/serverutlis/logger';
import { simulerJournalpostHendelse } from 'lib/services/postmottakservice/postmottakservice';
import { isServerError } from 'lib/utils/api';
import { isLocal } from 'lib/utils/environment';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Kun for lokal testing: skal ikke være tilgjengelig i andre miljøer, selv om noen
  // finner/gjetter URL-en direkte.
  if (!isLocal()) {
    return NextResponse.json({ message: 'Kun tilgjengelig lokalt' }, { status: 403 });
  }

  const body = await req.json();
  try {
    const res = await simulerJournalpostHendelse(body);
    if (isServerError(res)) {
      logError(
        `/postmottak/api/test/simuler-journalpost-hendelse ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
      );
    }
    // 204 kan ikke ha en body, så vi svarer med 200 og et tomt objekt for å unngå
    // "Response constructor: Invalid response status code 204" fra NextResponse.json.
    const status = res.status === 204 ? 200 : res.status;
    return NextResponse.json(res, { status });
  } catch (error) {
    logError('/postmottak/api/test/simuler-journalpost-hendelse', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
