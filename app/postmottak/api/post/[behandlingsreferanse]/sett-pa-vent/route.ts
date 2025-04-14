import { settPåVent } from 'lib/services/postmottakservice/postmottakservice';
import { NextRequest } from 'next/server';
import { SettPåVentRequest } from 'lib/types/postmottakTypes';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest, props: { params: Promise<{ behandlingsreferanse: string }> }) {
  const params = await props.params;
  const body: SettPåVentRequest = await req.json();

  try {
    const settPåVentResponse = await settPåVent(params.behandlingsreferanse, body);
    if (isError(settPåVentResponse)) {
      logError(
        `/api/post/sett-pa-vent ${settPåVentResponse.status} - ${settPåVentResponse.apiException.code}: ${settPåVentResponse.apiException.message}`
      );
    }
    const status = settPåVentResponse.status === 204 ? 200 : settPåVentResponse.status;
    return new Response(JSON.stringify(settPåVentResponse), { status });
  } catch (error) {
    logError('/api/post/sett-pa-vent', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
