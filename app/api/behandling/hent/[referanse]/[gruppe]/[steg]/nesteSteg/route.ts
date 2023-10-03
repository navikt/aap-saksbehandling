import { getToken } from 'lib/auth/authentication';
import { hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

const DEFAULT_TIMEOUT_IN_MS = 1000;
const RETRIES = 0;

const gruppeEllerStegErEndret = (
  aktivGruppe: string,
  aktivtSteg: string,
  aktivGruppeFraBackend: string,
  aktivtStegFraBackend: string
) => aktivGruppe !== aktivGruppeFraBackend || aktivtSteg !== aktivtStegFraBackend;

/* @ts-ignore-line */
export async function GET(__request, context: { params: { referanse: string; gruppe: string; steg: string } }) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  /* TODO: Ikke for prod prod, bør bruke noe mer async som funker der */
  const pollFlytMedTimeoutOgRetry = async (timeout: number, retries: number) => {
    setTimeout(async () => {
      console.log({ timeout, retries });
      if (retries > 10) {
        // TODO: Gi beskjed om at vi gir opp 🤷‍♀️
        writer.close();
        return;
      }
      const flyt = await hentFlyt2(context.params.referanse, getToken(headers()));
      if (gruppeEllerStegErEndret(context.params.gruppe, context.params.steg, flyt.aktivGruppe, flyt.aktivtSteg)) {
        console.log('Gruppe eller steg er endret!');
        const json = {
          aktivGruppe: flyt.aktivGruppe,
          aktivtSteg: flyt.aktivtSteg,
          skalBytteGruppe: flyt?.aktivGruppe !== context.params.gruppe,
        };

        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        writer.close();
        return;
      } else {
        pollFlytMedTimeoutOgRetry(timeout * 2, retries + 1);
      }
    }, timeout);
  };

  await pollFlytMedTimeoutOgRetry(DEFAULT_TIMEOUT_IN_MS, RETRIES);

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
