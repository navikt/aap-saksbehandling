'use client';

import { useEffect } from 'react';
import { getWebInstrumentations, initializeFaro, isInternalFaroOnGlobalObject, LogLevel } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { generateKelvinFaroPageId } from 'lib/utils/faro';

export default function Faro({ collectorUrl }: { collectorUrl?: string }) {
  useEffect(() => {
    // Avoid re-initializing (and the associated console warning) on re-renders caused by
    // React StrictMode / Fast Refresh in dev, since Faro registers itself on the global object.
    if (isInternalFaroOnGlobalObject()) {
      return;
    }

    try {
      initializeFaro({
        url: collectorUrl || 'https://telemetry.nav.no/collect',
        paused: window.location.hostname === 'localhost',
        app: {
          name: 'saksbehandling',
          namespace: 'aap',
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
