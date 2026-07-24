import { logError } from 'lib/serverutlis/logger';
import { bestillTestBrev } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError, isSuccess } from 'lib/utils/api';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body: { behandlingsreferanse: string } = await req.json();

  const res = await bestillTestBrev(body);
  if (isError(res) && res.status >= 500) {
    logError(`/test/bestill/brev ${res.status}, ${res.apiException.code}: ${res.apiException.message}`);
  }
  if (isSuccess(res)) {
    revalidatePath('/saksoversikt', 'page');
  }
  return NextResponse.json(res, { status: res.status });
}
