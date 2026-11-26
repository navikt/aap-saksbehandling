import { registerOTel } from '@vercel/otel';
import { isLocal } from 'lib/utils/environment';

export async function register() {
  registerOTel('saksbehandling');

  if (process.env.NEXT_RUNTIME === 'nodejs' && isLocal()) {
    const { logInfo } = await import('lib/serverutlis/logger');
    logInfo(`Lokale backender: ${process.env.LOCAL_BACKENDS ?? 'behandlingsflyt'}. Andre backender bruker mocks.`);
  }
}
