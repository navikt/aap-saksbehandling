import { NextRequest } from 'next/server';
import { logError } from 'lib/serverutlis/logger';
import { hentForhåndsvisningBrev } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET(req: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;
  const data = await hentForhåndsvisningBrev(params.brevbestillingReferanse);
  try {
    return new Response(data, { status: 200 });
  } catch (error) {
    logError('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
