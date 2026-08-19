import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTildelingssjekk } from './useTildelingssjekk';

const mockSetVisOverstyrModal = vi.fn();
const mockSetBekreftTildeling = vi.fn();
const mockSetAvbrytTildeling = vi.fn();
const mockSetReservertAvNavn = vi.fn();

vi.mock('hooks/saksbehandling/løsavklaringsbehov/useOverstyrTildeling', () => ({
  useOverstyrTildelingNyHook: () => ({
    setVisOverstyrModal: mockSetVisOverstyrModal,
    setBekreftTildeling: mockSetBekreftTildeling,
    setAvbrytTildeling: mockSetAvbrytTildeling,
    setReservertAvNavn: mockSetReservertAvNavn,
  }),
}));

const mockHentTildeltStatusClient = vi.fn();

vi.mock('lib/oppgaveClientApi', () => ({
  hentTildeltStatusClient: (...args: unknown[]) => mockHentTildeltStatusClient(...args),
}));

vi.mock('lib/utils/api', () => ({
  isSuccess: (res: { ok: boolean }) => res.ok,
}));

describe('useTildelingssjekk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('skal returnere true når behandlingen er tildelt innlogget bruker', async () => {
    mockHentTildeltStatusClient.mockResolvedValue({
      ok: true,
      data: {
        tildeltSaksbehandlerIdent: 'Z123456',
        erTildeltInnloggetBruker: true,
        tildeltSaksbehandlerNavn: 'Test Bruker',
      },
    });

    const { result } = renderHook(() => useTildelingssjekk('test-behandling-123'));

    let kanFortsette: boolean = false;
    await act(async () => {
      kanFortsette = await result.current.sjekkTildeling();
    });

    expect(kanFortsette).toBe(true);
    expect(mockSetVisOverstyrModal).not.toHaveBeenCalled();
    expect(mockSetBekreftTildeling).not.toHaveBeenCalled();
  });

  test('skal returnere true når ingen saksbehandler er tildelt', async () => {
    mockHentTildeltStatusClient.mockResolvedValue({
      ok: true,
      data: {
        tildeltSaksbehandlerIdent: null,
        erTildeltInnloggetBruker: false,
        tildeltSaksbehandlerNavn: null,
      },
    });

    const { result } = renderHook(() => useTildelingssjekk('test-behandling-123'));

    let kanFortsette: boolean = false;
    await act(async () => {
      kanFortsette = await result.current.sjekkTildeling();
    });

    expect(kanFortsette).toBe(true);
    expect(mockSetVisOverstyrModal).not.toHaveBeenCalled();
  });

  test('skal vise modal og resolve true når bruker bekrefter', async () => {
    mockHentTildeltStatusClient.mockResolvedValue({
      ok: true,
      data: {
        tildeltSaksbehandlerIdent: 'Z654321',
        erTildeltInnloggetBruker: false,
        tildeltSaksbehandlerNavn: 'Annen Saksbehandler',
      },
    });

    const { result } = renderHook(() => useTildelingssjekk('test-behandling-123'));

    let kanFortsette: boolean = false;
    await act(async () => {
      const promise = result.current.sjekkTildeling();

      await Promise.resolve();

      const simulerBekreftTildeling = mockSetBekreftTildeling.mock.calls[0][0];
      simulerBekreftTildeling()();

      kanFortsette = await promise;
    });

    expect(kanFortsette).toBe(true);
    expect(mockSetReservertAvNavn).toHaveBeenCalledWith('Annen Saksbehandler');
    expect(mockSetVisOverstyrModal).toHaveBeenCalledWith(true);
  });

  test('skal vise modal og resolve false når bruker avbryter', async () => {
    mockHentTildeltStatusClient.mockResolvedValue({
      ok: true,
      data: {
        tildeltSaksbehandlerIdent: 'Z654321',
        erTildeltInnloggetBruker: false,
        tildeltSaksbehandlerNavn: 'Annen Saksbehandler',
      },
    });

    const { result } = renderHook(() => useTildelingssjekk('test-behandling-123'));

    let kanFortsette: boolean = true;
    await act(async () => {
      const promise = result.current.sjekkTildeling();

      await Promise.resolve();

      const simulerAvbrytTildeling = mockSetAvbrytTildeling.mock.calls[0][0];
      simulerAvbrytTildeling()();

      kanFortsette = await promise;
    });

    expect(kanFortsette).toBe(false);
    expect(mockSetVisOverstyrModal).toHaveBeenCalledWith(true);
  });

  test('skal returnere true når API-kall feiler', async () => {
    mockHentTildeltStatusClient.mockResolvedValue({
      ok: false,
      error: 'Noe gikk galt',
    });

    const { result } = renderHook(() => useTildelingssjekk('test-behandling-123'));

    let kanFortsette: boolean = false;
    await act(async () => {
      kanFortsette = await result.current.sjekkTildeling();
    });

    expect(kanFortsette).toBe(true);
    expect(mockSetVisOverstyrModal).not.toHaveBeenCalled();
  });
});
