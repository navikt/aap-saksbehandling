import { logInfo } from '@navikt/aap-felles-utils';
import { collectDefaultMetrics, Counter, Histogram } from 'prom-client';

declare global {
  var _metrics: AppMetrics;
}

class AppMetrics {
  constructor() {
    logInfo('Initializing metrics client');
    collectDefaultMetrics();
  }

  public backendApiDurationHistogram = new Histogram({
    name: 'aap_saksbehandling_requests_duration_seconds',
    help: 'Load time for API call to saksbehandling-backend',
    labelNames: ['path'],
  });

  public backendApiStatusCodeCounter = new Counter({
    name: 'aap_saksbehandling_requests_status_code',
    help: 'Status code for API call to saksbehandling-backend',
    labelNames: ['path', 'status'],
  });

  public getServersidePropsDurationHistogram = new Histogram({
    name: 'aap_saksbehandling_get_serverside_props_duration_seconds',
    help: 'Load time for getServerSideProps',
    labelNames: ['path'],
  });
}

global._metrics = global._metrics || new AppMetrics();

export default global._metrics;
