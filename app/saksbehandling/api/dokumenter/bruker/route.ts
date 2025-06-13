import { NextRequest } from 'next/server';
import { hentAlleDokumenterPåBruker } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await hentAlleDokumenterPåBruker(body);

  return new Response(JSON.stringify(data), { status: 200 });
}
