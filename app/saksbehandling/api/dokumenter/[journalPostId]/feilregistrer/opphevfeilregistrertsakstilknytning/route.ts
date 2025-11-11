import { NextRequest, NextResponse } from 'next/server';
import { opphevFeilregistrertSakstilknytning } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

export async function POST(_: NextRequest, props: { params: Promise<{ journalPostId: string }> }) {
  const params = await props.params;

  const data = await opphevFeilregistrertSakstilknytning(params.journalPostId);

  return NextResponse.json(data, { status: 200 });
}
