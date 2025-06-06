import { hentAlleDokumenterPåBruker } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await hentAlleDokumenterPåBruker(body);

  return new Response(JSON.stringify(data), { status: 200 });
}
