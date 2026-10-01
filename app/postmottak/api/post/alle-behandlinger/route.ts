import { logError } from 'lib/serverutlis/logger';
import { alleBehandlinger } from 'lib/services/postmottakservice/postmottakservice';
import { isServerError } from 'lib/utils/api';
import { skalMockeBackend } from 'lib/utils/environment';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (skalMockeBackend(process.env.POSTMOTTAK_API_BASE_URL)) {
    return NextResponse.json([], { status: 200 });
  }

  const payload = await req.json();
  const ident = payload.ident;
  try {
    const res = await alleBehandlinger(ident);
    if (isServerError(res)) {
      logError(
        `postmottak/api/alle-behandlinger ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
      );
    }
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    logError('error i route', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
