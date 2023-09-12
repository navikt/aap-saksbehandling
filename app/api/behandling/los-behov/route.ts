import { getToken } from 'lib/auth/authentication';
import { løsAvklaringsbehov } from 'lib/services/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  await løsAvklaringsbehov(body, getToken(req.headers));

  return new Response(JSON.stringify({ message: 'Behov løst' }), { status: 200 });
}
