import { redigitaliser } from 'lib/services/postmottakservice/postmottakservice';
import { NextRequest, NextResponse } from 'next/server';
import { logInfo, logWarning } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { getErrorMessage } from 'lib/utils/errorUtil';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const redigitaliserRes = await redigitaliser(body.journalpostId, body.saksnummer);

    if (isError(redigitaliserRes)) {
      logInfo(`/postmottak/redigitaliser, message: ${redigitaliserRes.apiException.message}`);
    }
    return NextResponse.json(redigitaliserRes, { status: redigitaliserRes.status });
  } catch (error) {
    logWarning(`/postmottak/redigitaliser`, error);
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
  }
}
