import { NextRequest } from 'next/server';
import { endreRolle, hentRolle } from 'lib/services/rolleservice/rolleservice';

const roller = ['SAKSBEHANDLER', 'BESLUTTER', 'LESEVISNING'];
export type Rolle = (typeof roller)[number];

export async function GET() {
  const rolleCache = await hentRolle();
  const rolle: Rolle = (rolleCache as Rolle) || 'LESEVISNING';
  return new Response(JSON.stringify({ rolle }), { status: 200 });
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (roller.includes(body.rolle)) {
    await endreRolle(body.rolle);
  }
  return new Response('{}', { status: 200 });
}
