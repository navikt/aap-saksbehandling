import { bestillTestBrev } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logError } from 'lib/serverutlis/logger';

export async function POST(req: NextRequest) {
  const body: { behandlingReferanse: string } = await req.json();

  try {
    await bestillTestBrev(body);
  } catch (err: unknown) {
    logError('/test/bestill/brev/', err);
    return new Response(JSON.stringify({ message: err?.toString() }), { status: 500 });
  }
  revalidatePath('/saksoversikt', 'page');
  return new Response(JSON.stringify({ message: 'Brev bestilt' }), { status: 200 });
}
