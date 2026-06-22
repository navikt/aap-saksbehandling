import { NextRequest, NextResponse } from 'next/server';
import { alleBehandlinger } from 'lib/services/postmottakservice/postmottakservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { isLocal } from 'lib/utils/environment';

export async function POST(req: NextRequest) {
  if (isLocal()) {
    return NextResponse.json([], { status: 200 });
  }

  const payload = await req.json();
  const ident = payload.ident;
  try {
    const res = await alleBehandlinger(ident);
    if (isError(res)) {
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
