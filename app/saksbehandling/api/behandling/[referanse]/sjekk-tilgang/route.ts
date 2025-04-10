import { NextRequest } from 'next/server';
import { sjekkTilgang } from 'lib/services/tilgangservice/tilgangsService';

type SjekkTilgangRequestType = { kode: string };

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const body: SjekkTilgangRequestType = await req.json();

  const res = await sjekkTilgang(params.referanse, body.kode);
  return new Response(JSON.stringify(res), { status: 200 });
}
