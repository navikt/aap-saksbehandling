import { beforeAll, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

export const defaultFlytResponse: BehandlingFlytOgTilstand = {
  behandlingVersjon: 5,
  aktivGruppe: 'SYKDOM',
  aktivtSteg: 'AVKLAR_SYKDOM',
  aktivtStegDefinisjon: [],
  flyt: [],
  prosessering: {
    status: 'FERDIG',
    ventendeOppgaver: [],
  },
  visning: {
    beslutterReadOnly: false,
    kvalitetssikringReadOnly: false,
    saksbehandlerReadOnly: false,
    brukerHarBesluttet: false,
    brukerHarKvalitetssikret: false,
    typeBehandling: 'Førstegangsbehandling',
    visBeslutterKort: false,
    visBrevkort: false,
    visKvalitetssikringKort: false,
    visVentekort: false,
    resultatKode: null,
  },
};

let mockFlytResponse: BehandlingFlytOgTilstand = defaultFlytResponse;

export function setMockFlytResponse(flyt: BehandlingFlytOgTilstand) {
  mockFlytResponse = flyt;
}

export const resetMockFlytResponse = () => {
  mockFlytResponse = defaultFlytResponse;
};

beforeAll(() => {
  vi.mock('swr', () => ({
    default: vi.fn((key) => {
      if (key?.startsWith('api/flyt')) {
        return {
          data: { type: 'SUCCESS', status: 200, data: mockFlytResponse },
          error: undefined,
          mutate: vi.fn(),
        };
      }

      return { data: undefined, error: undefined, mutate: vi.fn() };
    }),
  }));

  vi.mock('next/navigation', () => ({
    useParams: vi
      .fn()
      .mockReturnValue({ saksId: '123', behandlingsReferanse: '123', behandlingsType: 'AVKLAR_SYKDOM' }),
    useRouter: vi.fn(),
  }));

  // Mocker eventsource ettersom vi bruker det i Form komponenten
  Object.defineProperty(window, 'EventSource', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      close: vi.fn(() => {}),
      addEventListener: vi.fn(),
    })),
  });

  // Mocker scrollIntoView da jsdom ikke implementerer denne
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

beforeEach(() => {
  resetMockFlytResponse();
});
