import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { BehandlingsFlytAvklaringsbehovKode, StegGruppe, StegType } from 'lib/types/types';
import { NextRequest } from 'next/server';
import { logInfo } from "@navikt/aap-felles-utils";

const DEFAULT_TIMEOUT_IN_MS = 500;
const RETRIES = 0;

export interface ServerSentEventData {
  aktivGruppe?: StegGruppe;
  aktivtSteg?: StegType;
  aktivtStegBehovsKode?: BehandlingsFlytAvklaringsbehovKode[];
  skalBytteGruppe?: boolean;
  skalBytteSteg?: boolean;
  status: ServerSentEventStatus;
  errormessage?: string;
}

export type ServerSentEventStatus = 'POLLING' | 'ERROR' | 'DONE';

export async function GET(
  __request: NextRequest,
  context: { params: Promise<{ referanse: string; gruppe: string; steg: string }> }
) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  const pollFlytMedTimeoutOgRetry = async (timeout: number, retries: number) => {
    setTimeout(async () => {
      logInfo(`Timeout: ${timeout}, Retries: ${retries}`);
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

      const flyt = await hentFlyt((await context.params).referanse);

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
        logInfo('Prosessering ferdig');
        const aktivGruppe = flyt.vurdertGruppe != null ? flyt.vurdertGruppe : flyt.aktivGruppe;
        const aktivtSteg = flyt.vurdertSteg != null ? flyt.vurdertSteg : flyt.aktivtSteg;

        const json: ServerSentEventData = {
          aktivGruppe,
          aktivtSteg,
          skalBytteGruppe: aktivGruppe !== (await context.params).gruppe,
          skalBytteSteg: aktivtSteg !== (await context.params).steg,
          aktivtStegBehovsKode: flyt.aktivtStegDefinisjon.map((definisjon) => definisjon.kode),
          status: 'DONE',
        };

        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        writer.close();
        return;
      } else {
        logInfo('Prosessering jobber');
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
