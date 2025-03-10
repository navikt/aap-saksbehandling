import { NextRequest } from 'next/server';
import { hentFlyt } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { logError } from '@navikt/aap-felles-utils';

export async function GET(req: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const params = await props.params;
  try {
    const data = await hentFlyt(params.behandlingsreferanse);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    logError('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
