import { hentAlleDokumenterPåSak } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export async function GET(_: NextApiRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const data = await hentAlleDokumenterPåSak(params.saksnummer);

  return NextResponse.json(data, { status: 200 });
}
