import { logError } from 'lib/serverutlis/logger';
import { bestillDialogmelding } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isLocal } from 'lib/utils/environment';
import { NextRequest, NextResponse } from 'next/server';
import { FetchResponse, isError } from 'lib/utils/api';

const lokalFakeBestillingAvDokumenter = isLocal();
export async function POST(req: NextRequest) {
  if (lokalFakeBestillingAvDokumenter) {
    const response: FetchResponse<unknown> = {
      type: 'SUCCESS',
      status: 200,
      data: { response: '1234' },
    };

    return NextResponse.json(response, { status: 200 });
  }

  const body = await req.json();

  const res = await bestillDialogmelding(body);

  if (isError(res)) {
    logError('Feil ved bestilling av dialogmelding', res.apiException.message);
  }

  return NextResponse.json(res, { status: 200 });
}
