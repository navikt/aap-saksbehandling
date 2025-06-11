import { hentAlleDokumenterPåSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const data = await hentAlleDokumenterPåSak(params.saksnummer);

  return new Response(JSON.stringify(data), { status: 200 });
}
