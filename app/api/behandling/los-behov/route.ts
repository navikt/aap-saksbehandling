import { getToken } from 'lib/auth/authentication';
import { løsAvklaringsbehov } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    await løsAvklaringsbehov(body, getToken(req.headers));

    return new Response(JSON.stringify({ message: 'Behov løst' }), { status: 200 });
  } catch (error) {
    console.log('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
