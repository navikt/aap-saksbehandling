import { getToken } from 'lib/auth/authentication';
import { hentBehandling } from 'lib/services/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { referanse: string } }) {
  const token = getToken(req.headers);
  const data = await hentBehandling(params.referanse, token);

  if (data !== undefined) {
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen sak funnet.' }), { status: 500 });
  }
}
