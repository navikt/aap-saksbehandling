import { NextRequest } from 'next/server';
import { knyttTilAnnenSak } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

export async function POST(req: NextRequest, props: { params: Promise<{ journalPostId: string }> }) {
  const params = await props.params
  const request = await req.json();

  const data = await knyttTilAnnenSak(params.journalPostId, request);

  return new Response(JSON.stringify(data), { status: 200 });
}
