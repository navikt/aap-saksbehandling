import { NextRequest } from 'next/server';
import { feilregistrerSakstilknytning } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

export async function POST(_: NextRequest, props: { params: Promise<{ journalPostId: string }> }) {
  const params = await props.params;

  const data = await feilregistrerSakstilknytning(params.journalPostId);

  return new Response(JSON.stringify(data), { status: 200 });
}
