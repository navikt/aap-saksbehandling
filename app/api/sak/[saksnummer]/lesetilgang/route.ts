import {
    hentLesetilgang
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest, { params }: { params: { saksnummer: string } }) {
    const data = await hentLesetilgang(params.saksnummer);

    if (data !== undefined) {
        return new Response(JSON.stringify(data), { status: 200 });
    } else {
        return new Response(JSON.stringify({ message: 'Ingen tilgang funnet.' }), { status: 500 });
    }
}
