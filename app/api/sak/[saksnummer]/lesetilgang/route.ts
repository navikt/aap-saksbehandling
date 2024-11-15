import { hentLesetilgang } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest, props: { params: Promise<{ saksnummer: string }> }) {
  const params = await props.params;
  const data = await hentLesetilgang(params.saksnummer);

  if (data !== undefined) {
    return new Response(JSON.stringify(data), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'Ingen tilgang funnet.' }), { status: 500 });
  }
}
