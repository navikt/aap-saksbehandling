import { afterEach, beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

beforeAll(() => {
  vi.mock('next/navigation', () => ({
    useParams: vi
      .fn()
      .mockReturnValue({ saksId: '123', behandlingsReferanse: '123', behandlingsType: 'AVKLAR_SYKDOM' }),
    useRouter: vi.fn(),
  }));

  // Mockes for testing av Tiptap. jsdom implementerer ikke denne
  Object.defineProperty(window, 'ClipboardEvent', {
    writable: false,
    value: vi.fn(),
  });

  // Mockes for testing av Tiptap. jsdom implementerer ikke denne
  Object.defineProperty(window, 'DragEvent', {
    writable: false,
    value: vi.fn(),
  });

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

afterEach(() => {
  cleanup();
});
