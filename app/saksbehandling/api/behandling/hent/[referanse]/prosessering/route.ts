import { logError, logInfo } from 'lib/serverutlis/logger';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { FlytProsesseringStatus } from 'lib/types/types';
import { NextRequest } from 'next/server';
import { ServerSentEventData } from 'app/saksbehandling/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { isError } from 'lib/utils/api';
import Prometheus from 'lib/prometheus';

const DEFAULT_TIMEOUT_IN_MS = 1000;
const RETRIES = 0;

export interface FlytProsesseringServerSentEvent {
  status: FlytProsesseringStatus;
}

const endepunkt = 'behandlingsflyt-prosessering' as const;

export async function GET(_: NextRequest, context: { params: Promise<{ referanse: string }> }) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const startTime = Date.now();

  const pollFlytMedTimeoutOgRetry = async (timeout: number, retries: number) => {
    setTimeout(async () => {
      logInfo(`Timeout: ${timeout}, Retries: ${retries}`);
      if (retries > 8) {
        const json: FlytProsesseringServerSentEvent = {
          status: 'FEILET',
        };
        await writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        await writer.close();
        Prometheus.observePolling(startTime, { endepunkt, status: json.status, retries, reason: 'MAX_RETRIES' });
        return;
      }

      const flyt = await hentFlyt((await context.params).referanse);

      if (isError(flyt)) {
        const errorString = `prosessering hentFlyt ${flyt.status} - ${flyt.apiException.code}: ${flyt.apiException.message}`;
        logError(errorString);
        const json: ServerSentEventData = {
          status: 'ERROR',
          errormessage: errorString,
        };
        await writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        await writer.close();
        Prometheus.observePolling(startTime, { endepunkt, status: json.status, retries, reason: 'FETCH_ERROR' });
        return;
      }

      if (flyt.data.prosessering.status === 'FERDIG' || flyt.data.prosessering.status === 'FEILET') {
        logInfo('Prosessering er ferdig!');
        const json: FlytProsesseringServerSentEvent = {
          status: flyt.data.prosessering.status,
        };

        await writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        await writer.close();
        Prometheus.observePolling(startTime, {
          endepunkt,
          status: json.status,
          retries,
          reason: flyt.data.prosessering.status === 'FERDIG' ? undefined : 'JOBB_ERROR',
        });
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
