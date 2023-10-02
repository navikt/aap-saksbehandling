import '@testing-library/react';

jest.mock('next/navigation', () => ({
  useParams: jest
    .fn()
    .mockReturnValue({ saksId: '123', behandlingsReferanse: '123', behandlingsType: 'AVKLAR_SYKDOM' }),
  useRouter: jest.fn(),
}));

// Mocker eventsource ettersom vi bruker det i Form komponenten
Object.defineProperty(window, 'EventSource', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    close: jest.fn(() => {}),
    addEventListener: jest.fn(),
  })),
});

export * from '@testing-library/react';
