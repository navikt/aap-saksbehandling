import { simulerMeldeplikt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
import { logError } from "@navikt/aap-felles-utils";

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const body = await req.json();

  try {
    const res = await simulerMeldeplikt(params.referanse, body);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    logError('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
