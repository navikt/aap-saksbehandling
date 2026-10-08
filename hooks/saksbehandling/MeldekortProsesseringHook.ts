import { useCallback } from 'react';
import { MeldekortProsesseringServerSentEvent } from 'app/saksbehandling/api/meldekort/[saksnummer]/prosessering/route';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

interface VentPåMeldekortProsesseringOptions {
  onSuccess?: () => void;
  onTimeout?: (message: string) => void;
  onError?: (message: string) => void;
}

export function useMeldekortProsessering(): {
  ventPåMeldekortProsessering: (options?: VentPåMeldekortProsesseringOptions) => void;
} {
  const { saksnummer } = useParamsMedType();

  const ventPåMeldekortProsessering = useCallback(
    (options?: VentPåMeldekortProsesseringOptions) => {
      const eventSource = new EventSource(`/saksbehandling/api/meldekort/${saksnummer}/prosessering/`, {
        withCredentials: true,
      });

      eventSource.onmessage = async (event: MessageEvent) => {
        const eventData: MeldekortProsesseringServerSentEvent = JSON.parse(event.data);

        if (eventData.status === 'KLAR') {
          eventSource.close();
          options?.onSuccess?.();
        } else {
          eventSource.close();
          options?.onTimeout?.('Meldekort ble sendt inn, men prosesseringen tok for lang tid. Prøv å laste siden på nytt.');
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        options?.onError?.('Noe gikk galt under prosessering av meldekort.');
      };
    },
    [saksnummer]
  );

  return { ventPåMeldekortProsessering };
}
