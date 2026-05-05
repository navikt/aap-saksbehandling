'use client';

import { useEffect } from 'react';
import { faro, getWebInstrumentations, initializeFaro, LogLevel } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

export default function Faro({ collectorUrl }: { collectorUrl?: string }) {
  useEffect(() => {
    if (faro.api) return; // already initialized

    try {
      initializeFaro({
        url: collectorUrl || 'https://telemetry.nav.no/collect',
        paused: window.location.hostname === 'localhost',
        app: {
          name: 'saksbehandling',
        },
        instrumentations: [
          ...getWebInstrumentations(),
          new TracingInstrumentation({
            instrumentationOptions: {
              propagateTraceHeaderCorsUrls: [/https:\/\/[^/]+\.nav\.no\/.*/],
            },
          }),
        ],
        pageTracking: {
          generatePageId: (location: Location) =>
            location.pathname.replace(
              /\/saksbehandling\/sak\/[^/]+\/[^/]+/,
              '/saksbehandling/sak/{saksid}/{behandlingsreferanse}'
            ),
        },
        consoleInstrumentation: {
          disabledLevels: [LogLevel.DEBUG, LogLevel.TRACE], // capture log, info, warn, error
        },
      });
    } catch (e) {
      console.warn('Faro initialization failed', e);
    }
  }, [collectorUrl]);

  return null;
}
