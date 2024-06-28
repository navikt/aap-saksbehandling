import { NextRequest } from 'next/server';
import { rekjørJobb } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET(req: NextRequest, { params }: { params: { jobbid: string } }) {
  try {
    return new Response(await rekjørJobb(params.jobbid), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
