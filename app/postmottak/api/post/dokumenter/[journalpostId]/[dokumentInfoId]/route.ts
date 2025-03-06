import { NextRequest } from 'next/server';
import { logError } from '@navikt/aap-felles-utils';
import { hentDokumentFraDokumentInfoId } from 'lib/services/dokumentmottakservice/dokumentMottakService';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ journalpostId: number; dokumentInfoId: string }> }
) {
  const params = await props.params;
  const data = await hentDokumentFraDokumentInfoId(params.journalpostId, params.dokumentInfoId);
  try {
    return new Response(data, { status: 200 });
  } catch (error) {
    logError('error i route', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
