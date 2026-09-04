import { hentHelsedokumenterPåBruker } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { NextRequest, NextResponse } from 'next/server';
import { skalMockeBackend } from 'lib/utils/environment';
import { mockResponseHelsedokumenter } from 'lib/test/local/mockResponseHelsedokumenter';

export async function POST(req: NextRequest) {
  if (skalMockeBackend(process.env.DOKUMENTINNHENTING_API_BASE_URL)) {
    return NextResponse.json(mockResponseHelsedokumenter, { status: 200 });
  }

  const body = await req.json();

  const data = await hentHelsedokumenterPåBruker(body);

  return NextResponse.json(data, { status: 200 });
}
