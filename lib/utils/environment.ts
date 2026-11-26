export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
export const isProd = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';
export const isDev = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev';

type Backend = 'behandlingsflyt' | 'postmottak' | 'oppgave' | 'dokumentinnhenting';

/**
 * Oppstartskommandoen velger lokale backender med LOCAL_BACKENDS.
 * Uten et eksplisitt valg bruker vi bare behandlingsflyt.
 */
export const erBackendLokal = (backend: Backend) =>
  isLocal() && (process.env.LOCAL_BACKENDS ?? 'behandlingsflyt').split(',').includes(backend);

export const skalMockeBackend = (backend: Backend) => isLocal() && !erBackendLokal(backend);
