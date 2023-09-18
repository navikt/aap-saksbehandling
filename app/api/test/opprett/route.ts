import { getToken } from 'lib/auth/authentication';
import { opprettTestSak } from 'lib/services/saksbehandlingService';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const body = await req.json();

  await opprettTestSak(body, getToken(req.headers));
  revalidatePath('/saksoversikt');
  return new Response(JSON.stringify({ message: 'Sak opprettet' }), { status: 200 });
}
