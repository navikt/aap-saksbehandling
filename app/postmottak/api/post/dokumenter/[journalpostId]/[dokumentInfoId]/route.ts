import { NextRequest, NextResponse } from 'next/server';
import { hentDokumentFraDokumentInfoId } from 'lib/services/postmottakservice/postmottakservice';
import { logError } from 'lib/serverutlis/logger';

export async function GET(
  _: NextRequest,
  props: { params: Promise<{ journalpostId: number; dokumentInfoId: string }> }
) {
  const params = await props.params;
  const data = await hentDokumentFraDokumentInfoId(params.journalpostId, params.dokumentInfoId);
  try {
    return new Response(data, { status: 200 });
  } catch (error) {
    logError('error i route', error);
    return NextResponse.json({ message: JSON.stringify(error) }, { status: 500 });
  }
}
