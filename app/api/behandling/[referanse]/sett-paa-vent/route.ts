import { settBehandlingPåVent } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest, { params }: { params: { referanse: string } }) {
  const body = await req.json();

  try {
    await settBehandlingPåVent(params.referanse, body);
    revalidateTag(`api/hent/${params.referanse}/flyt`);
    return new Response(JSON.stringify({ message: 'Behandling er satt på vent' }), { status: 200 });
  } catch (error) {
    console.log('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
