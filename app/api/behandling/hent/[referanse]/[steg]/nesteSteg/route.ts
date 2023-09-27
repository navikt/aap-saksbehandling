import { getToken } from 'lib/auth/authentication';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

/* @ts-ignore-line */
export async function GET(__request, context: { params: { referanse: string; steg: string } }) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  // TODO: Kjøre i loop, med eksponensiell timeout (maks eks antall sekunder)
  const flyt = await hentFlyt(context.params.referanse, getToken(headers()));
  if (flyt?.aktivtSteg !== context.params.steg) {
    writer.write(`event: message\ndata: ${flyt?.aktivtSteg}\n\n`);
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
