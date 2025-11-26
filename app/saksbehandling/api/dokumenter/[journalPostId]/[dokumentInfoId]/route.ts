import { NextApiRequest } from 'next';
import { hentDokument } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';

export async function GET(
  _: NextApiRequest,
  props: { params: Promise<{ journalPostId: string; dokumentInfoId: string }> }
) {
  const params = await props.params;

  return await hentDokument(params.journalPostId, params.dokumentInfoId);
}
