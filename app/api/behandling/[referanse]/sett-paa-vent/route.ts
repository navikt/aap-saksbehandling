import { settBehandlingPåVent } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const body = await req.json();

  try {
    await settBehandlingPåVent(params.referanse, body);
    return new Response(JSON.stringify({ message: 'Behandling er satt på vent' }), { status: 200 });
  } catch (error) {
    console.log('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
