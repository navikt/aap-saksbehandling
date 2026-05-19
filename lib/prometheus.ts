import client, { Histogram } from 'prom-client';

class Prometheus {
  public register;
  public pollingHistogram: Histogram;

  constructor() {
    const collectDefaultMetrics = client.collectDefaultMetrics;

    this.register = new client.Registry();

    this.pollingHistogram = new client.Histogram({
      name: 'sse_behandling_prosessering_millis',
      help: 'Time until polling succeeds or fails.',
      labelNames: ['endepunkt', 'status', 'retries', 'reason'],
      buckets: [
        100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10_000,
        20_000, 30_000,
      ],
    });
    this.register.registerMetric(this.pollingHistogram);

    collectDefaultMetrics({
      register: this.register,
    });
  }

  observePolling(startTime: number, { status, retries, reason, endepunkt }: Labels) {
    this.pollingHistogram.labels(endepunkt, status, retries.toString(), reason ?? '').observe(Date.now() - startTime);
  }
}
type Labels = { status: string; retries: number; reason?: Reason; endepunkt: Endepunkt };
type Reason = 'JOBB_ERROR' | 'MAX_RETRIES' | 'FETCH_ERROR';
type Endepunkt = 'behandlingsflyt-nesteSteg' | 'behandlingsflyt-prosessering' | 'postmottak-nesteSteg';

const prometheus = new Prometheus();

export default prometheus;
