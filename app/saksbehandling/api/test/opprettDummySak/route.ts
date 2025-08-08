import { opprettDummySakTest } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logError } from 'lib/serverutlis/logger';
import { isError } from 'lib/utils/api';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await opprettDummySakTest(body);
  if (isError(res)) {
    logError(`/test/opprettDummySak/, status: ${res.status}, message: ${res.apiException.message}`);
  }
  revalidatePath('/saksoversikt', 'page');
  return new Response(JSON.stringify(res), { status: res.status });
}
