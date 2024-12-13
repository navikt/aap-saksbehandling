import { hentAlleSaker } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET() {
  const data = await hentAlleSaker();

  if (data !== undefined) {
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen saker funnet.' }), { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
