import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvklaringsbehovReturer } from './AvklaringsbehovReturer';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';

const user = userEvent.setup();

const data = [
  {
    returerPerAvklaringsbehov: [
      {
        avklaringsbehov: '5006',
        returFra: 'SENDT_TILBAKE_FRA_BESLUTTER',
        returÅrsak: 'MANGLENDE_UTREDNING',
        antallÅpneBehandlinger: 1,
        gjennomsnittTidFraRetur: 1291692.105611,
      },
    ],
    totalt: 1,
  },
];

describe('AvklaringsbehovReturer', () => {
  beforeEach(() => {
    render(
      <InnloggetBrukerContextProvider bruker={{ navn: 'Test Testesen', NAVident: 'Z123456' }}>
        <AvklaringsbehovReturer data={data} />
      </InnloggetBrukerContextProvider>
    );
  });

  it('kan switche av årsak ', async () => {
    expect(screen.getByRole('columnheader', { name: /Årsak til retur/i })).toBeInTheDocument();

    const årsakSwitch = screen.getByRole('checkbox', { name: /Årsak til retur/i });
    await user.click(årsakSwitch);

    expect(screen.queryByRole('columnheader', { name: /Årsak til retur/i })).not.toBeInTheDocument();
  });
});
