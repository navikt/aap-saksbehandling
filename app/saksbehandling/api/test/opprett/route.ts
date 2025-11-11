import { opprettDummySakDev } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await opprettDummySakDev(body);
  if (isError(res)) {
    logError(`/test/opprett/, status: ${res.status}, message: ${res.apiException.message}`);
  }
  revalidatePath('/saksoversikt', 'page');
  return NextResponse.json(res, { status: res.status });
}
