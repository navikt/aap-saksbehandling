import { NextApiRequest } from 'next';
import { hentUtsendingsinfo } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { NextResponse } from 'next/server';

export async function GET(_: NextApiRequest, props: { params: Promise<{ journalPostId: string }> }) {
  const params = await props.params;

  const res = await hentUtsendingsinfo(params.journalPostId);

  return NextResponse.json(res, { status: res.status });
}
