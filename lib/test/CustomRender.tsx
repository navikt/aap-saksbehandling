import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach } from 'vitest';
import { IngenFlereOppgaverModalContextProvider } from 'context/IngenFlereOppgaverModalContext';

afterEach(() => {
  cleanup();
});

export function customRender(ui: ReactElement) {
  render(<IngenFlereOppgaverModalContextProvider>{ui}</IngenFlereOppgaverModalContextProvider>);
}

export * from '@testing-library/react';
export { customRender as render };
