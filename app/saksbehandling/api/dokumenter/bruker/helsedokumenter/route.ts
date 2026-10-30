import { hentHelsedokumenterPåBruker } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { NextRequest, NextResponse } from 'next/server';
import { isLocal } from 'lib/utils/environment';
import { mockResponseHelsedokumenter } from 'lib/test/local/mockResponseHelsedokumenter';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { HentHelsedokumenterPåBrukerRequest } from 'lib/types/types';

export async function POST(req: NextRequest) {
  if (isLocal()) {
    return NextResponse.json(mockResponseHelsedokumenter, { status: 200 });
  }

  const body = await readRequestBody<HentHelsedokumenterPåBrukerRequest>(req);

  const data = await hentHelsedokumenterPåBruker(body);

  return NextResponse.json(data, { status: 200 });
}
