import { NextRequest } from 'next/server';
import { sjekkTilgang } from 'lib/services/tilgangservice/tilgangsService';
import { logError } from "@navikt/aap-felles-utils";

type SjekkTilgangRequestType = { kode: string };

export async function POST(req: NextRequest, props: { params: Promise<{ referanse: string }> }) {
  const params = await props.params;
  const body: SjekkTilgangRequestType = await req.json();

  try {
    const harTilgang = await sjekkTilgang(params.referanse, body.kode);
    return new Response(JSON.stringify({ harTilgangTilNesteOppgave: harTilgang.tilgang }), { status: 200 });
  } catch (error) {
    logError('Noe gikk galt i kallet sjekk tilgang', error);

    // Vi returnerer true da dette kallet ikke skal hindre noe.
    return new Response(JSON.stringify({ harTilgangTilNesteOppgave: true }), { status: 200 });
  }
}
