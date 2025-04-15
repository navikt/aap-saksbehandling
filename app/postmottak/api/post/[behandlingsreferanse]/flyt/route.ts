import { NextRequest } from 'next/server';
import { hentFlyt } from 'lib/services/postmottakservice/postmottakservice';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function GET(req: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const params = await props.params;
  try {
    const res = await hentFlyt(params.behandlingsreferanse);
    if (isError(res)) {
      logError(`/postmottak/api/flyt ${res.status} - ${res.apiException.code}: ${res.apiException.message}`);
    }
    return new Response(JSON.stringify(res), { status: res.status });
  } catch (error) {
    logError('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
