import { FinnSakForIdent } from 'lib/types/types';
import { finnSakerForIdent } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body: FinnSakForIdent = await req.json();
  if (!body.ident) {
    return NextResponse.json({ message: 'ident mangler' }, { status: 400 });
  }

  const sakerResponse = await finnSakerForIdent(body.ident);
  if (isError(sakerResponse)) {
    logError(
      `/api/sak/finn ${sakerResponse.status}, ${sakerResponse.apiException.code}: ${sakerResponse.apiException.message}`
    );
  }
  return NextResponse.json(sakerResponse, { status: sakerResponse.status });
}
