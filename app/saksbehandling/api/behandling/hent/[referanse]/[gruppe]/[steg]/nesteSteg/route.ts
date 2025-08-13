import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { BehandlingsFlytAvklaringsbehovKode, StegGruppe, StegType } from 'lib/types/types';
import { NextRequest } from 'next/server';
import { logError, logInfo } from 'lib/serverutlis/logger';

const DEFAULT_TIMEOUT_IN_MS = 500;
const RETRIES = 0;

export interface ServerSentEventData {
  gjeldendeSteg?: StegType;
  aktivVisningGruppe?: StegGruppe;
  aktivtVisningSteg?: StegType;
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
      if (flyt.type === 'ERROR') {
        const errorString = `neste-steg hentFlyt ${flyt.status} - ${flyt.apiException.code}: ${flyt.apiException.message}`;
        logError(errorString);
        const json: ServerSentEventData = {
          status: 'ERROR',
          errormessage: errorString,
        };
        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        writer.close();
        return;
      }

      const { vurdertGruppe, vurdertSteg, aktivGruppe, aktivtSteg, aktivtStegDefinisjon, prosessering } = flyt.data;

      if (prosessering.status === 'FEILET') {
        const json: ServerSentEventData = {
          status: 'ERROR',
          errormessage: `Prosessering feilet i backend`,
        };

        writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        writer.close();
        return;
      }

      if (prosessering.status === 'FERDIG') {
        logInfo('Prosessering ferdig');

        // vurdertGruppe og vurdertSteg er tilstede for å utlede hvilken visningsgruppe frontend skal rute til for kvalitetsikring / totrinn
        const aktivVisningGruppe = vurdertGruppe != null ? vurdertGruppe : aktivGruppe;
        const aktivtVisningSteg = vurdertSteg != null ? vurdertSteg : aktivtSteg;

        const json: ServerSentEventData = {
          gjeldendeSteg: aktivtSteg,
          aktivVisningGruppe,
          aktivtVisningSteg,
          skalBytteGruppe: aktivGruppe !== (await context.params).gruppe,
          skalBytteSteg: aktivtSteg !== (await context.params).steg,
          aktivtStegBehovsKode: aktivtStegDefinisjon.map((definisjon) => definisjon.kode),
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
