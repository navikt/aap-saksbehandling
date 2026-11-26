import { afterEach, describe, expect, it, vi } from 'vitest';
import { erBackendLokal, skalMockeBackend } from './environment';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('lokale backender', () => {
  it('bruker bare behandlingsflyt som standard, selv med localhost-URL-er', () => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'localhost');
    vi.stubEnv('LOCAL_BACKENDS', undefined);
    vi.stubEnv('POSTMOTTAK_API_BASE_URL', 'http://localhost:8070');
    vi.stubEnv('OPPGAVE_API_BASE_URL', 'http://localhost:8084');

    expect(erBackendLokal('behandlingsflyt')).toBe(true);
    expect(skalMockeBackend('postmottak')).toBe(true);
    expect(skalMockeBackend('oppgave')).toBe(true);
    expect(skalMockeBackend('dokumentinnhenting')).toBe(true);
  });

  it.each(['postmottak', 'oppgave'] as const)('bruker valgt backend %s uten å aktivere den andre', (backend) => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'localhost');
    vi.stubEnv('LOCAL_BACKENDS', `behandlingsflyt,${backend}`);

    expect(erBackendLokal(backend)).toBe(true);
    expect(skalMockeBackend(backend)).toBe(false);
    expect(skalMockeBackend(backend === 'postmottak' ? 'oppgave' : 'postmottak')).toBe(true);
  });

  it('bruker alle tre lokale backender uten å aktivere dokumentinnhenting', () => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'localhost');
    vi.stubEnv('LOCAL_BACKENDS', 'behandlingsflyt,postmottak,oppgave');

    expect(erBackendLokal('behandlingsflyt')).toBe(true);
    expect(erBackendLokal('postmottak')).toBe(true);
    expect(erBackendLokal('oppgave')).toBe(true);
    expect(skalMockeBackend('dokumentinnhenting')).toBe(true);
  });

  it.each(['dev', 'prod'])('ignorerer lokalt backendvalg i %s', (environment) => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', environment);
    vi.stubEnv('LOCAL_BACKENDS', 'behandlingsflyt,postmottak,oppgave');

    expect(erBackendLokal('postmottak')).toBe(false);
    expect(skalMockeBackend('postmottak')).toBe(false);
    expect(skalMockeBackend('oppgave')).toBe(false);
  });
});
