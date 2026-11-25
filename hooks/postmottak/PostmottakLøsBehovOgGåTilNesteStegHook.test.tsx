import { act, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverstyrTildelingModal } from 'components/overstyrtildelingmodal/OverstyrTildelingModal';
import { OverstyrTildelingContextProvider } from 'context/saksbehandling/OverstyrTildelingContext';
import { hentTildeltStatusClient } from 'lib/oppgaveClientApi';
import { postmottakLøsBehovClient } from 'lib/postmottakClientApi';
import { AvklarSaksnummerLøsning, LøsAvklaringsbehovPåBehandling } from 'lib/types/postmottakTypes';
import { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { usePostmottakLøsBehovOgGåTilNesteSteg } from './PostmottakLøsBehovOgGåTilNesteStegHook';

vi.mock('lib/oppgaveClientApi', () => ({
  hentTildeltStatusClient: vi.fn(),
}));

vi.mock('lib/postmottakClientApi', () => ({
  postmottakLøsBehovClient: vi.fn(),
}));

const behov: LøsAvklaringsbehovPåBehandling<AvklarSaksnummerLøsning> = {
  referanse: '456',
  behandlingVersjon: 1,
  behov: {
    behovstype: '1340',
    opprettNySak: true,
    førPåGenerellSak: false,
  },
};

function wrapper({ children }: { children: ReactNode }) {
  return (
    <OverstyrTildelingContextProvider>
      <OverstyrTildelingModal />
      {children}
    </OverstyrTildelingContextProvider>
  );
}

function setupTest() {
  const user = userEvent.setup();
  const { result } = renderHook(() => usePostmottakLøsBehovOgGåTilNesteSteg('AVKLAR_SAK'), { wrapper });

  const løsBehov = async (løsning: typeof behov) => {
    await act(async () => {
      result.current.løsBehovOgGåTilNesteSteg(løsning);
    });
  };

  return {
    result,
    løsBehov,
    bekreftOverstyring: () => user.click(screen.getByRole('button', { name: 'Bekreft og fortsett' })),
    avbrytOverstyring: () => user.click(screen.getByRole('button', { name: 'Avbryt' })),
  };
}

describe('usePostmottakLøsBehovOgGåTilNesteSteg', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'dev');
    vi.mocked(hentTildeltStatusClient).mockResolvedValue({
      type: 'SUCCESS',
      data: {
        tildeltSaksbehandlerIdent: 'Z654321',
        tildeltSaksbehandlerNavn: 'Annen Saksbehandler',
        erTildeltInnloggetBruker: false,
      },
    });
    vi.mocked(postmottakLøsBehovClient).mockResolvedValue({ type: 'SUCCESS', data: undefined });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('bekreftelse sender løsningen uten en ny tildelingssjekk', async () => {
    const { result, løsBehov, bekreftOverstyring } = setupTest();

    await løsBehov(behov);

    expect(screen.getByText(/Denne oppgaven er tildelt Annen Saksbehandler/)).toBeVisible();
    expect(postmottakLøsBehovClient).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);

    await bekreftOverstyring();

    await waitFor(() => {
      expect(postmottakLøsBehovClient).toHaveBeenCalledExactlyOnceWith(behov);
    });
    expect(hentTildeltStatusClient).toHaveBeenCalledExactlyOnceWith('456');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('avbryt lukker modalen uten å sende løsningen, og tillater et nytt forsøk', async () => {
    const { result, løsBehov, bekreftOverstyring, avbrytOverstyring } = setupTest();

    await løsBehov(behov);
    await avbrytOverstyring();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(postmottakLøsBehovClient).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);

    const nyttBehov = { ...behov, behandlingVersjon: 2 };
    await løsBehov(nyttBehov);
    await bekreftOverstyring();

    await waitFor(() => {
      expect(postmottakLøsBehovClient).toHaveBeenCalledExactlyOnceWith(nyttBehov);
    });
  });

  test('feil ved innsending etter bekreftelse returneres til skjemaet', async () => {
    vi.mocked(postmottakLøsBehovClient).mockResolvedValue({
      type: 'ERROR',
      status: 500,
      apiException: { message: 'Kunne ikke lagre løsningen' },
    });
    const { result, løsBehov, bekreftOverstyring } = setupTest();

    await løsBehov(behov);
    await bekreftOverstyring();

    await waitFor(() => {
      expect(result.current.løsBehovOgGåTilNesteStegError).toEqual({ message: 'Kunne ikke lagre løsningen' });
    });
    expect(result.current.isLoading).toBe(false);
  });
});
