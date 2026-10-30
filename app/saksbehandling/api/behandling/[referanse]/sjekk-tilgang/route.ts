import { NextRequest, NextResponse } from 'next/server';
import { sjekkTilgang } from 'lib/services/tilgangservice/tilgangsService';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { SjekkTilgangRequest } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const body = await readRequestBody<SjekkTilgangRequest>(req);

  const res = await sjekkTilgang(params.referanse, body.kode);
  return NextResponse.json(res, { status: 200 });
}
