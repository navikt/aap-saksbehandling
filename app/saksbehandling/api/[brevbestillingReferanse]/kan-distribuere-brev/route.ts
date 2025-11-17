import { NextRequest, NextResponse } from 'next/server';
import { kanDistribuereBrev } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest, props: { params: Promise<{ brevbestillingReferanse: string }> }) {
  const params = await props.params;
  const res = await kanDistribuereBrev(params.brevbestillingReferanse, await req.json());

  if (isError(res)) {
    logError(
      `/api/${params.brevbestillingReferanse}/kan-distribuere-brev ${res.status} - ${res.apiException.code}: ${res.apiException.message}`
    );
  }
  return NextResponse.json(res, { status: res.status });
}
