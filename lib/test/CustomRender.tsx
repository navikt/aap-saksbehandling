import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach } from 'vitest';
import { IngenFlereOppgaverModalContextProvider } from 'context/saksbehandling/IngenFlereOppgaverModalContext';
import { SakContextProvider } from 'context/saksbehandling/SakContext';
import { SakPersoninformasjonContextProvider } from 'context/saksbehandling/SakPersoninformasjonContext';
import { addDays, format } from 'date-fns';
import { TildelOppgaverContext } from 'context/oppgave/TildelOppgaverContext';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';
import { OverstyrTildelingContextProvider } from 'context/saksbehandling/OverstyrTildelingContext';
import { Roller } from 'lib/types/types';

afterEach(() => {
  cleanup();
});

const today = format(new Date(), 'yyyy-MM-dd');
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

const defaultPersonInformasjon = { personReferanse: '1234', navn: 'Peder Ås', fnr: '12345678910' };

export function customRender(ui: ReactElement) {
  return render(
    <InnloggetBrukerContextProvider bruker={{ NAVident: 'Z000000', navn: 'Test Testesen', roller: [] }}>
      <FeatureFlagProvider flags={mockedFlags}>
        <IngenFlereOppgaverModalContextProvider>
          <OverstyrTildelingContextProvider>
            <SakPersoninformasjonContextProvider SakPersonInfo={defaultPersonInformasjon}>
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
            </SakPersoninformasjonContextProvider>
          </OverstyrTildelingContextProvider>
        </IngenFlereOppgaverModalContextProvider>
      </FeatureFlagProvider>
    </InnloggetBrukerContextProvider>
  );
}

export function customRenderWithSøknadstidspunkt(ui: ReactElement, søknadstidspunkt: string) {
  render(
    <FeatureFlagProvider flags={mockedFlags}>
      <IngenFlereOppgaverModalContextProvider>
        <OverstyrTildelingContextProvider>
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
        </OverstyrTildelingContextProvider>
      </IngenFlereOppgaverModalContextProvider>
    </FeatureFlagProvider>
  );
}

export function customRenderWithTildelOppgaveContext(ui: ReactElement, visModal: boolean, bruker?: string) {
  render(
    <InnloggetBrukerContextProvider bruker={{ NAVident: bruker || 'Z000000', navn: 'Test Testesen', roller: [] }}>
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

export function customRenderMedRoller(ui: ReactElement, roller: Roller[]) {
  return render(
    <InnloggetBrukerContextProvider bruker={{ NAVident: 'Z000000', navn: 'Test Testesen', roller }}>
      <FeatureFlagProvider flags={mockedFlags}>
        <IngenFlereOppgaverModalContextProvider>
          <OverstyrTildelingContextProvider>
            <SakPersoninformasjonContextProvider SakPersonInfo={defaultPersonInformasjon}>
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
            </SakPersoninformasjonContextProvider>
          </OverstyrTildelingContextProvider>
        </IngenFlereOppgaverModalContextProvider>
      </FeatureFlagProvider>
    </InnloggetBrukerContextProvider>
  );
}

export * from '@testing-library/react';
export { customRender as render };
