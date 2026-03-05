import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach } from 'vitest';
import { IngenFlereOppgaverModalContextProvider } from 'context/saksbehandling/IngenFlereOppgaverModalContext';
import { SakContextProvider } from 'context/saksbehandling/SakContext';
import { addDays, format } from 'date-fns';
import { TildelOppgaverContext } from 'context/oppgave/TildelOppgaverContext';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';

afterEach(() => {
  cleanup();
});

const today = format(new Date(), 'yyyy-MM-dd');
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

export function customRender(ui: ReactElement) {
  return render(
    <FeatureFlagProvider flags={mockedFlags}>
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
    </FeatureFlagProvider>
  );
}

export function customRenderWithSøknadstidspunkt(ui: ReactElement, søknadstidspunkt: string) {
  render(
    <FeatureFlagProvider flags={mockedFlags}>
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
    </FeatureFlagProvider>
  );
}

export function customRenderWithTildelOppgaveContext(ui: ReactElement, visModal: boolean, bruker?: string) {
  render(
    <InnloggetBrukerContextProvider bruker={{ NAVident: bruker || 'Z000000', navn: 'Test Testesen' }}>
      <FeatureFlagProvider flags={mockedFlags}>
        <TildelOppgaverContext.Provider
          value={{ oppgaveIder: [], setOppgaveIder: () => {}, visModal, setVisModal: () => {} }}
        >
          {ui}
        </TildelOppgaverContext.Provider>
      </FeatureFlagProvider>
    </InnloggetBrukerContextProvider>
  );
}

export * from '@testing-library/react';
export { customRender as render };
