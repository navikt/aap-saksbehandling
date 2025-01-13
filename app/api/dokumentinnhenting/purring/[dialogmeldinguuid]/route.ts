import { logError } from '@navikt/aap-felles-utils';
import { purrPåLegeerklæring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isLocal } from 'lib/utils/environment';

export async function POST(_: Request, { params }: { params: Promise<{ dialogmeldinguuid: string }> }) {
  const dialogmeldingUUID = (await params).dialogmeldinguuid;
  if (isLocal()) {
    return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
  }
  try {
    const res = purrPåLegeerklæring(dialogmeldingUUID);
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    logError('Feil ved purring på legeklæring', error);
    return new Response(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 });
  }
}
