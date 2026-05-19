import { logError, logInfo } from 'lib/serverutlis/logger';
import { hentMeldekortProsseseringStatus } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { MeldekortProsesseringStatus } from 'lib/types/types';
import { NextRequest } from 'next/server';
import { isError } from 'lib/utils/api';

const DEFAULT_TIMEOUT_IN_MS = 1000;
const MAX_RETRIES = 8;

export interface MeldekortProsesseringServerSentEvent {
  status: MeldekortProsesseringStatus;
}

export async function GET(_: NextRequest, context: { params: Promise<{ saksnummer: string }> }) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  const pollMeldekortMedTimeoutOgRetry = async (timeout: number, retries: number) => {
    setTimeout(async () => {
      logInfo(`Meldekort prosessering - Timeout: ${timeout}, Retries: ${retries}`);

      if (retries > MAX_RETRIES) {
        const json: MeldekortProsesseringServerSentEvent = {
          status: 'PROSESSERER_MELDEKORT',
        };
        await writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        await writer.close();
        return;
      }

      const meldekortResponse = await hentMeldekortProsseseringStatus((await context.params).saksnummer);

      console.log('meldekortResponse', meldekortResponse);

      if (isError(meldekortResponse)) {
        const errorString = `meldekort prosessering hentMeldekort ${meldekortResponse.status} - ${meldekortResponse.apiException.code}: ${meldekortResponse.apiException.message}`;
        logError(errorString);
        const json: MeldekortProsesseringServerSentEvent = {
          status: 'PROSESSERER_MELDEKORT',
        };
        await writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        await writer.close();
        return;
      }

      if (meldekortResponse.data.meldekortProsesseringStatus === 'KLAR') {
        logInfo('Meldekort prosessering er ferdig!');
        const json: MeldekortProsesseringServerSentEvent = {
          status: 'KLAR',
        };
        await writer.write(`event: message\ndata: ${JSON.stringify(json)}\n\n`);
        await writer.close();
        return;
      } else {
        await pollMeldekortMedTimeoutOgRetry(timeout * 1.3, retries + 1);
      }
    }, timeout);
  };

  await pollMeldekortMedTimeoutOgRetry(DEFAULT_TIMEOUT_IN_MS, 0);

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
