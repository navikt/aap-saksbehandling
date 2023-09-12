import { getToken } from 'lib/auth/authentication';
import { hentAlleSaker } from 'lib/services/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = getToken(req.headers);

  const data = await hentAlleSaker(token);

  if (data !== undefined) {
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen saker funnet.' }), { status: 500 });
  }
}
