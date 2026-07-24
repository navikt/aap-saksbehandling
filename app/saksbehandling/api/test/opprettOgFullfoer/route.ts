import { logError } from 'lib/serverutlis/logger';
import { opprettOgFullfoerDummySak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isServerError } from 'lib/utils/api';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await opprettOgFullfoerDummySak(body);
  if (isServerError(res)) {
    logError(`/test/opprettOgFullfoer/, status: ${res.status}, message: ${res.apiException.message}`);
  }
  revalidatePath('/saksoversikt', 'page');
  return NextResponse.json(res, { status: res.status });
}
