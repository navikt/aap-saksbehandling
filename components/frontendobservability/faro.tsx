'use client';

import { useEffect } from 'react';
import { faro, getWebInstrumentations, initializeFaro, LogLevel } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { generateKelvinFaroPageId } from 'lib/utils/faro';

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
        ignoreErrors: ['ResizeObserver loop'],
        instrumentations: [
          ...getWebInstrumentations(),
          new TracingInstrumentation({
            instrumentationOptions: {
              propagateTraceHeaderCorsUrls: [/https:\/\/[^/]+\.nav\.no\/.*/],
            },
          }),
        ],
        pageTracking: {
          generatePageId: generateKelvinFaroPageId,
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
