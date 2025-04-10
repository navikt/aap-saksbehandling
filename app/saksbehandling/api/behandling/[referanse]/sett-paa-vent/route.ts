import { settBehandlingPåVent } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const body = await req.json();

  const res = await settBehandlingPåVent(params.referanse, body);
  return new Response(JSON.stringify(res), { status: 200 });
}
