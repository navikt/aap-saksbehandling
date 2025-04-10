import { hentAlleSaker } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET() {
  const data = await hentAlleSaker();

  return new Response(JSON.stringify(data), { status: 200 });
}

export const dynamic = 'force-dynamic';
