import { NextRequest, NextResponse } from 'next/server';
import { hentAlleDokumenterPåBruker } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { isLocal } from 'lib/utils/environment';
import { mockResponseDokumenter } from 'lib/test/local/mockResponseDokumenter';

export async function POST(req: NextRequest) {
  if (isLocal()) {
    return NextResponse.json(mockResponseDokumenter, { status: 200 });
  }

  const body = await req.json();
  const data = await hentAlleDokumenterPåBruker(body);

  return NextResponse.json(data, { status: data.status });
}
