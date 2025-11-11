import { NextRequest, NextResponse } from 'next/server';
import { hentAlleDokumenterPåBruker } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await hentAlleDokumenterPåBruker(body);

  return NextResponse.json(data, { status: data.status });
}
