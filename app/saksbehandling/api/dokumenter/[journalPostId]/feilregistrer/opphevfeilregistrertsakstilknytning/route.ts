import { NextRequest } from 'next/server';
import { opphevFeilregistrertSakstilknytning } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

export async function POST(_: NextRequest, props: { params: Promise<{ journalPostId: string }> }) {
  const params = await props.params;

  const data = await opphevFeilregistrertSakstilknytning(params.journalPostId);

  return new Response(JSON.stringify(data), { status: 200 });
}
