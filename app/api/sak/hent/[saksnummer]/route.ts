import { getToken } from 'lib/auth/authentication';
import { hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { saksnummer: string } }) {
  const token = getToken(req.headers);
  const data = await hentSak(params.saksnummer, token);

  if (data !== undefined) {
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen sak funnet.' }), { status: 500 });
  }
}
