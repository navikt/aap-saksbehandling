import { NextRequest } from 'next/server';
import { endreTema } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { logError } from 'lib/serverutlis/logger';

export async function POST(req: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const params = await props.params;
  try {
    const data = await endreTema(params.behandlingsreferanse);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    logError('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
