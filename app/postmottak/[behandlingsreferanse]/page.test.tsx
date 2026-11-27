import { expect, it, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { hentFlyt } from 'lib/services/postmottakservice/postmottakservice';
import { PostmottakFlytResponse } from 'vitestSetup';
import Page from './page';

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('lib/services/postmottakservice/postmottakservice', () => ({ hentFlyt: vi.fn() }));

it.each(['UNDER18', 'AVKLAR_SAK'] as const)(
  'åpner aktiv steggruppe %s fra den vanlige flytresponsen',
  async (aktivGruppe) => {
    vi.mocked(hentFlyt).mockResolvedValue({
      type: 'SUCCESS',
      status: 200,
      data: {
        ...PostmottakFlytResponse,
        aktivGruppe,
        visning: {
          ...PostmottakFlytResponse.visning,
          typeBehandling: aktivGruppe === 'UNDER18' ? 'Under18' : 'Journalføring',
        },
      },
    });

    await Page({ params: Promise.resolve({ behandlingsreferanse: '456' }) });

    expect(redirect).toHaveBeenLastCalledWith(`/postmottak/456/${aktivGruppe}`);
  }
);
