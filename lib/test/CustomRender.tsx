import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach } from 'vitest';
import { IngenFlereOppgaverModalContextProvider } from 'context/saksbehandling/IngenFlereOppgaverModalContext';
import { SakContextProvider } from 'context/saksbehandling/SakContext';
import { addDays, format } from 'date-fns';

afterEach(() => {
  cleanup();
});

const today = format(new Date(), 'yyyy-MM-dd');
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

export function customRender(ui: ReactElement) {
  render(
    <IngenFlereOppgaverModalContextProvider>
      <SakContextProvider
        sak={{
          saksnummer: '12345',
          ident: '12345678910',
          opprettetTidspunkt: today,
          periode: { fom: today, tom: tomorrow },
          virkningsTidspunkt: today,
        }}
      >
        {ui}
      </SakContextProvider>
    </IngenFlereOppgaverModalContextProvider>
  );
}

export function customRenderWithSøknadstidspunkt(ui: ReactElement, søknadstidspunkt: string) {
  render(
    <IngenFlereOppgaverModalContextProvider>
      <SakContextProvider
        sak={{
          saksnummer: '12345',
          ident: '12345678910',
          opprettetTidspunkt: today,
          periode: { fom: søknadstidspunkt, tom: tomorrow },
          virkningsTidspunkt: today,
        }}
      >
        {ui}
      </SakContextProvider>
    </IngenFlereOppgaverModalContextProvider>
  );
}

export * from '@testing-library/react';
export { customRender as render };
