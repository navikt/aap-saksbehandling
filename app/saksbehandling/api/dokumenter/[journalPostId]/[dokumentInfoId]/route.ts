import { NextApiRequest } from 'next';
import { hentDokument } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { NextResponse } from 'next/server';

export async function GET(
  _: NextApiRequest,
  props: { params: Promise<{ journalPostId: string; dokumentInfoId: string }> }
) {
  const params = await props.params;
  const blob = await hentDokument(params.journalPostId, params.dokumentInfoId);

  if (blob !== undefined) {
    return new Response(blob, { status: 200, headers: new Headers({ 'Content-Type': blob.type }) });
  } else {
    return NextResponse.json({ message: 'Ingen dokument funnet.' }, { status: 500 });
  }
}
