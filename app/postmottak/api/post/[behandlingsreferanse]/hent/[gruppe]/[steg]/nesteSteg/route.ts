import { logInfo, logWarning } from '@navikt/aap-felles-utils';
import { hentFlyt } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { StegGruppe, StegType } from 'lib/types/postmottakTypes';
import { NextRequest } from 'next/server';

const DEFAULT_TIMEOUT_IN_MS = 1000;
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
  context: { params: Promise<{ behandlingsreferanse: string; gruppe: string; steg: string }> }
) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  const pollFlytMedTimeoutOgRetry = async (timeout: number, retries: number) => {
    setTimeout(async () => {
      if (retries > 8) {
        logWarning('Antall retries mot hentFlyt er brukt opp');
        const json: ServerSentEventData = {
          status: 'ERROR',
          errormessage: 'Antall retries er brukt opp',
        };
        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        writer.close();
        return;
      }
      if (retries === 3) {
        const json: ServerSentEventData = {
          status: 'POLLING',
        };

        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
      }

      const flyt = await hentFlyt((await context.params).behandlingsreferanse);
      const aktivGruppe = flyt.aktivGruppe;
      const aktivtSteg = flyt.aktivtSteg;

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
        logInfo(`prosessering ferdig på ${retries} forsøk`);

        // TODO: Tar bort vurdertGruppe og vurdertSteg foreløpig til vi finner ut av hva de skal brukes til
        const json: ServerSentEventData = {
          aktivGruppe: flyt.aktivGruppe,
          aktivtSteg: flyt.aktivtSteg,
          skalBytteGruppe: aktivGruppe !== (await context.params).gruppe,
          skalBytteSteg: aktivtSteg !== (await context.params).steg,
          status: 'DONE',
        };

        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        writer.close();
        return;
      } else {
        await pollFlytMedTimeoutOgRetry(timeout * 1.3, retries + 1);
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
