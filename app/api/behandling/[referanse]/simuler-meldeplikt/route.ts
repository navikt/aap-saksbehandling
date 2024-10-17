import { simulerMeldeplikt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { referanse: string } }) {
  const body = await req.json();

  try {
    const res = await simulerMeldeplikt(params.referanse, body);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    console.log('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
