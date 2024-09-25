import { NextRequest } from 'next/server';
import { avbrytJobb } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET(req: NextRequest, { params }: { params: { jobbid: string } }) {
  try {
    return new Response(await avbrytJobb(params.jobbid), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
