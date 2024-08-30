import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegGruppe, StegType } from 'lib/types/types';
import { NextRequest } from 'next/server';

const DEFAULT_TIMEOUT_IN_MS = 500;
const RETRIES = 0;

export interface ServerSentEventData {
  aktivGruppe?: StegGruppe;
  aktivtSteg?: StegType;
  skalBytteGruppe?: boolean;
  skalBytteSteg?: boolean;
  status: ServerSentEventStatus;
  errormessage?: string;
}

export type ServerSentEventStatus = 'POLLING' | 'ERROR' | 'DONE';

export async function GET(
  __request: NextRequest,
  context: { params: { referanse: string; gruppe: string; steg: string } }
) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  const pollFlytMedTimeoutOgRetry = async (timeout: number, retries: number) => {
    setTimeout(async () => {
      console.log({ timeout, retries });
      if (retries > 19) {
        const json: ServerSentEventData = {
          status: 'ERROR',
          errormessage: 'Antall retries er brukt opp',
        };
        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        writer.close();
        return;
      }
      if (retries === 10) {
        const json: ServerSentEventData = {
          status: 'POLLING',
        };

        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
      }

      const flyt = await hentFlyt(context.params.referanse);

      if (flyt.prosessering.status === 'FEILET') {
        const json: ServerSentEventData = {
          status: 'ERROR',
          errormessage: `Prosessering feilet i backend`,
        };

        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        writer.close();
        return;
      }

      if (flyt.prosessering.status === 'FERDIG') {
        console.log('Prosessering ferdig');
        const aktivGruppe = flyt.vurdertGruppe != null ? flyt.vurdertGruppe : flyt.aktivGruppe;
        const aktivtSteg = flyt.vurdertSteg != null ? flyt.vurdertSteg : flyt.aktivtSteg;

        const json: ServerSentEventData = {
          aktivGruppe: flyt.vurdertGruppe != null ? flyt.vurdertGruppe : flyt.aktivGruppe,
          aktivtSteg: flyt.vurdertSteg != null ? flyt.vurdertSteg : flyt.aktivtSteg,
          skalBytteGruppe: aktivGruppe !== context.params.gruppe,
          skalBytteSteg: aktivtSteg !== context.params.steg,
          status: 'DONE',
        };

        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        writer.close();
        return;
      } else {
        console.log('Prosessering jobber');
        await pollFlytMedTimeoutOgRetry(DEFAULT_TIMEOUT_IN_MS, retries + 1);
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
