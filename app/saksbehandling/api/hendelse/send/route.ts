import { NextRequest } from "next/server";
import { sendLokalHendelse } from "lib/services/saksbehandlingservice/saksbehandlingService";
import { logError } from "@navikt/aap-felles-utils";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    await sendLokalHendelse(body);
  } catch (err) {
    logError(`/api/hendelse/send`, err);
    return new Response(JSON.stringify({ message: 'Feil ved sending av lokal hendelse' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
