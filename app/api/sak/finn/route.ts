import { FinnSakForIdent } from 'lib/types/types';
import {NextResponse} from "next/server";
import {finnSakerForIdent} from "lib/services/saksbehandlingservice/saksbehandlingService";
import { logError } from '@navikt/aap-felles-utils';

export async function POST(req: Request) {
  const body: FinnSakForIdent = await req.json();

  let data = [];
  try {
    data = await finnSakerForIdent(body.ident);
    } catch (err) {
      logError('/api/sak/finn', err);
      return new Response(JSON.stringify({ message: 'Noe gikk galt' }), { status: 500 });
    }

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Methods": `GET`,
        "Access-Control-Allow-Headers": `Content-Type, Authorization`,
        "Access-Control-Allow-Origin": `${process.env.OPPGAVESTYRING_FRONTEND_HOST}`,
      },
      status: 200
    });
}
