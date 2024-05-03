import { logError } from '@navikt/aap-felles-utils';
import { rekjørFeiledeOppgaver } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export async function GET() {
  try {
    await rekjørFeiledeOppgaver();
  } catch (err: unknown) {
    logError('/test/rekjørfeilede/', err);
    return new Response(JSON.stringify({ message: err?.toString() }), { status: 500 });
  }
  return new Response(JSON.stringify({ message: 'Rekjører feilede oppgaver' }), { status: 200 });
}
