import { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { Roller } from 'lib/types/types';
import { InnloggetBrukerContext, InnloggetBrukerContextProvider } from './InnloggetBrukerContext';

function BrukerVisning() {
  const bruker = useContext(InnloggetBrukerContext);
  return (
    <div>
      {bruker?.NAVident}:{bruker?.roller[0]}
    </div>
  );
}

describe('InnloggetBrukerContextProvider', () => {
  it('oppdaterer ident og rolle når brukerprop endres', () => {
    const førsteBruker: BrukerInformasjon = {
      navn: 'Veileder',
      NAVident: 'V123456',
      roller: [Roller.SAKSBEHANDLER_OPPFØLGING],
    };
    const nesteBruker: BrukerInformasjon = {
      navn: 'Beslutter',
      NAVident: 'B123456',
      roller: [Roller.BESLUTTER],
    };
    const { rerender } = render(
      <InnloggetBrukerContextProvider bruker={førsteBruker}>
        <BrukerVisning />
      </InnloggetBrukerContextProvider>
    );

    expect(screen.getByText('V123456:Veileder')).toBeInTheDocument();

    rerender(
      <InnloggetBrukerContextProvider bruker={nesteBruker}>
        <BrukerVisning />
      </InnloggetBrukerContextProvider>
    );

    expect(screen.getByText('B123456:Beslutter')).toBeInTheDocument();
  });
});
