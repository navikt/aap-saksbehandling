import { hentHelsedokumenterPåBruker } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await hentHelsedokumenterPåBruker(body);

  return new Response(JSON.stringify(data), { status: 200 });
}
