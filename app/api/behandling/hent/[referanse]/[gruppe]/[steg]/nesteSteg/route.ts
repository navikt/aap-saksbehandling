import { getToken } from 'lib/auth/authentication';
import { hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

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

  let timeout = 1000;
  const getTimeout = () => timeout;
  let flyt = await hentFlyt2(context.params.referanse, getToken(headers()));
  for (let retries = 0; retries < 10; retries++) {
    console.log({ timeout, retries });
    console.log(context.params);
    console.log(flyt.aktivGruppe + '::' + flyt.aktivtSteg);
    if (gruppeEllerStegErEndret(context.params.gruppe, context.params.steg, flyt.aktivGruppe, flyt.aktivtSteg)) {
      console.log('Gruppe eller steg er endret!');
      const json = {
        aktivGruppe: flyt.aktivGruppe,
        aktivtSteg: flyt.aktivtSteg,
        skalBytteGruppe: flyt?.aktivGruppe !== context.params.gruppe,
      };

      writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
      writer.close();
      break;
    }
    setTimeout(async () => {
      flyt = await hentFlyt2(context.params.referanse, getToken(headers()));
      console.log('Har hentet data');
    }, getTimeout());
    timeout = timeout * 2;
  }

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
