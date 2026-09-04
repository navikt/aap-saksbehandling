import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { isLocal } from 'lib/utils/environment';
import { mockResponseMeldinger } from 'lib/test/local/mockResponseMeldinger';
import { hentAlleDialogmeldingerMedDokumentIdPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET(_: NextApiRequest, props: { params: Promise<{ saksnummer: string }> }) {
  if (isLocal()) {
    return NextResponse.json(mockResponseMeldinger, { status: 200 });
  }

  const params = await props.params;
  const data = await hentAlleDialogmeldingerMedDokumentIdPåSak(params.saksnummer);

  return NextResponse.json(data, { status: 200 });
}
