import { settBehandlingPåVent } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextRequest, NextResponse } from 'next/server';
import { readRequestBody } from 'lib/serverutlis/readRequestBody';
import { SettPåVent } from 'lib/types/types';

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const body = await readRequestBody<SettPåVent>(req);

  const res = await settBehandlingPåVent(params.referanse, body);
  return NextResponse.json(res, { status: 200 });
}
