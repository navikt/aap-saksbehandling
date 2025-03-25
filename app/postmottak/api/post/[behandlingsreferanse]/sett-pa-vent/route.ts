import { settPåVent } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { NextRequest } from 'next/server';
import { SettPåVentRequest } from 'lib/types/postmottakTypes';
import { logError } from 'lib/serverutlis/logger';

export async function POST(req: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const params = await props.params;
  const body: SettPåVentRequest = await req.json();

  try {
    const settPåVentResponse = await settPåVent(params.behandlingsreferanse, body);

    return new Response(JSON.stringify(settPåVentResponse ?? {}), { status: 200 });
  } catch (error) {
    logError('/api/post/sett-pa-vent', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
