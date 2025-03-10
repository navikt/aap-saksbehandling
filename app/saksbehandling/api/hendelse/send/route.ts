import { NextRequest } from "next/server";
import { sendLokalHendelse } from "lib/services/saksbehandlingservice/saksbehandlingService";
import { logError } from "@navikt/aap-felles-utils";
import { isLocal } from "lib/utils/environment";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!isLocal()) {
    return new Response(JSON.stringify({ message: 'Kan kun sende hendelse hvis localhost!' }), { status: 500 })
  }

  try {
    await sendLokalHendelse(body);
  } catch (err) {
    logError(`/api/hendelse/send`, err);
    return new Response(JSON.stringify({ message: 'Feil ved sending av lokal hendelse' }), { status: 500 });
  }
  return new Response(JSON.stringify({}), { status: 200 });
}
