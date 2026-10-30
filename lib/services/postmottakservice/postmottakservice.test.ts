import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { clientFetch } from 'lib/clientApi';
import { postmottakOpprettBehandlingClient } from 'lib/postmottakClientApi';
import { apiFetch } from 'lib/services/apiFetch';
import { opprettBehandlingForJournalpost } from './postmottakservice';
import { OpprettPostmottakBehandlingRequest } from 'lib/types/postmottakTypes';

vi.mock('server-only', () => ({}));
vi.mock('lib/clientApi', () => ({ clientFetch: vi.fn() }));
vi.mock('lib/services/apiFetch', () => ({ apiFetch: vi.fn() }));
vi.mock('lib/serverutlis/logger', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  logWarning: vi.fn(),
}));

describe('opprett postmottakbehandling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sender journalpostreferansen med OpenAPI-feltnavnet fra nettleseren', () => {
    postmottakOpprettBehandlingClient(123);

    expect(clientFetch).toHaveBeenCalledWith('/postmottak/api/test/behandling/opprett/', 'POST', {
      referanse: 123,
    });
  });

  it('videresender samme kontrakt til postmottak og beholder UUID-responsen', async () => {
    const body = { referanse: 123 } satisfies OpprettPostmottakBehandlingRequest;
    const response = {
      type: 'SUCCESS',
      status: 200,
      data: { referanse: '534ead87-0d46-4772-a50f-66047ee0a16c' },
    } as const;
    vi.mocked(apiFetch).mockResolvedValue(response);

    const result = await opprettBehandlingForJournalpost(body);

    expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/behandling'), expect.any(String), 'POST', body);
    expect(result).toBe(response);
    if (result.type === 'SUCCESS') {
      expectTypeOf(result.data.referanse).toEqualTypeOf<string>();
    }
  });
});
