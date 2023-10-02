import '@testing-library/react';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

Object.defineProperty(window, 'EventSource', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    close: jest.fn(() => {}),
    addEventListener: jest.fn(),
  })),
});

export * from '@testing-library/react';
