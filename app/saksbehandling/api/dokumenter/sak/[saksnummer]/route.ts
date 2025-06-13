import { hentAlleDokumenterPåSak } from 'lib/services/dokumentinnhentingservice/dokumentinnhentingservice';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const data = await hentAlleDokumenterPåSak(params.saksnummer);

  return new Response(JSON.stringify(data), { status: 200 });
}
