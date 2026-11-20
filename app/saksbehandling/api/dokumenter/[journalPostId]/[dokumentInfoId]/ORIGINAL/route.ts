import { NextApiRequest } from 'next';
import { hentDokumentOriginal } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { NextResponse } from 'next/server';

export async function GET(
  _: NextApiRequest,
  props: { params: Promise<{ journalPostId: string; dokumentInfoId: string }> }
) {
  const params = await props.params;

  const res = await hentDokumentOriginal(params.journalPostId, params.dokumentInfoId);
  return NextResponse.json(res, { status: res.status });
}
