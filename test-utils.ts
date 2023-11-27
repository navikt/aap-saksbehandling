import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useParams: jest
    .fn()
    .mockReturnValue({ saksId: '123', behandlingsReferanse: '123', behandlingsType: 'AVKLAR_SYKDOM' }),
  useRouter: jest.fn(),
}));

// Mockes for testing av Tiptap. jsdom implementerer ikke denne
Object.defineProperty(window, 'ClipboardEvent', {
  writable: false,
  value: jest.fn(),
});

// Mockes for testing av Tiptap. jsdom implementerer ikke denne
Object.defineProperty(window, 'DragEvent', {
  writable: false,
  value: jest.fn(),
});

// Mocker eventsource ettersom vi bruker det i Form komponenten
Object.defineProperty(window, 'EventSource', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    close: jest.fn(() => {}),
    addEventListener: jest.fn(),
  })),
});

// Mocker scrollIntoView da jsdom ikke implementerer denne
window.HTMLElement.prototype.scrollIntoView = function () {};
