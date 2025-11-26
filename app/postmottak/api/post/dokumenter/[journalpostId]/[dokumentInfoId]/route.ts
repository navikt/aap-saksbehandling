import { NextRequest } from 'next/server';
import { hentDokumentFraDokumentInfoId } from 'lib/services/postmottakservice/postmottakservice';

export async function GET(
  _: NextRequest,
  props: { params: Promise<{ journalpostId: number; dokumentInfoId: string }> }
) {
  const params = await props.params;

  return await hentDokumentFraDokumentInfoId(params.journalpostId, params.dokumentInfoId);
}
