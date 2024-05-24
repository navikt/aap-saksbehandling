import { NextRequest } from 'next/server';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET(req: NextRequest, { params }: { params: { referanse: string } }) {
  try {
    const data = await hentFlyt(params.referanse);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
