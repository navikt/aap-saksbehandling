import { hentAlleDokumenterPåSak } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { isLocal } from 'lib/utils/environment';
import { mockResponseDokumenter } from 'lib/test/local/mockResponseDokumenter';

export async function GET(_: NextApiRequest, props: { params: Promise<{ saksnummer: string }> }) {
  if (isLocal()) {
    return NextResponse.json(mockResponseDokumenter, { status: 200 });
  }

  const params = await props.params;
  const data = await hentAlleDokumenterPåSak(params.saksnummer);

  return NextResponse.json(data, { status: 200 });
}
