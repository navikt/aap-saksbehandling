import { bestillTestBrev } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logError } from 'lib/serverutlis/logger';
import { isError, isSuccess } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const body: { behandlingReferanse: string } = await req.json();

  const res = await bestillTestBrev(body);
  if (isError(res)) {
    logError(`/test/bestill/brev ${res.status}, ${res.apiException.code}: ${res.apiException.message}`);
  }
  if (isSuccess(res)) {
    revalidatePath('/saksoversikt', 'page');
  }
  return new Response(JSON.stringify(res), { status: res.status });
}
