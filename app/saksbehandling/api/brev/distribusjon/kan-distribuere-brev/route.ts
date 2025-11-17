import { logError } from 'lib/serverutlis/logger';
import { isLocal } from 'lib/utils/environment';
import { NextRequest } from 'next/server';
import { FetchResponse, isError } from 'lib/utils/api';
import { kanDistribuereBrev } from 'lib/services/saksbehandlingservice/saksbehandlingService';

const lokalFakeKanDistribuereBrev = isLocal();

export async function POST(req: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  if (lokalFakeKanDistribuereBrev) {
    const response: FetchResponse<unknown> = {
      type: 'SUCCESS',
      status: 200,
      data: { response: '1234' },
    };

    return new Response(JSON.stringify(response), { status: 200 });
  }

  const params = await props.params;
  const body = await req.json();
  const res = await kanDistribuereBrev(params.brevbestillingReferanse, body);

  if (isError(res)) {
    logError('Feil ved henting av distribusjonstatus', res.apiException.message);
  }

  return new Response(JSON.stringify(res), { status: 200 });
}
