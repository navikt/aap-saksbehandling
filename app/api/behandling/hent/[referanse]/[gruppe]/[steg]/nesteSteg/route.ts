import { getToken } from 'lib/auth/authentication';
import { hentFlyt2 } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

/* @ts-ignore-line */
export async function GET(__request, context: { params: { referanse: string; gruppe: string; steg: string } }) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  // TODO: Kjøre i loop, med eksponensiell timeout (maks eks antall sekunder)
  const flyt = await hentFlyt2(context.params.referanse, getToken(headers()));

  if (flyt?.aktivGruppe !== context.params.gruppe || flyt?.aktivtSteg !== context.params.steg) {
    const json = {
      aktivGruppe: flyt.aktivGruppe,
      aktivtSteg: flyt.aktivtSteg,
      skalBytteGruppe: flyt?.aktivGruppe !== context.params.gruppe,
    };

    writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
    writer.close();
  }

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
