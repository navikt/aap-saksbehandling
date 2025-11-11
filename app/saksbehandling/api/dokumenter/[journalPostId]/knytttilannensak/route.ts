import { NextRequest, NextResponse } from 'next/server';
import { knyttTilAnnenSak } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

export async function POST(req: NextRequest, props: { params: Promise<{ journalPostId: string }> }) {
  const params = await props.params;
  const request = await req.json();

  const data = await knyttTilAnnenSak(params.journalPostId, request);

  return NextResponse.json(data, { status: 200 });
}
