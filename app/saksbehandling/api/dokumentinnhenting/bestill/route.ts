import { logError } from 'lib/serverutlis/logger';
import { bestillDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isLocal } from 'lib/utils/environment';
import { NextRequest } from 'next/server';
import { FetchResponse, isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  if (isLocal()) {
    const response: FetchResponse<unknown> = {
      type: 'SUCCESS',
      status: 200,
      data: { response: '1234' },
    };

    return new Response(JSON.stringify(response), { status: 200 });
  }

  const body = await req.json();

  const res = await bestillDialogmelding(body);

  if (isError(res)) {
    logError('Feil ved bestilling av dialogmelding', res.apiException.message);
  }

  return new Response(JSON.stringify(res), { status: 200 });
}
