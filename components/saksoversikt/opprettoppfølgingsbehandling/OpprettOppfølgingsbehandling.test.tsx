import { describe, expect, it, vi } from 'vitest';
import { OpprettOppfølgingsBehandling } from './OpprettOppfølgingsbehandling';
import { render, screen } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';

const user = userEvent.setup();

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('opprett oppfølgingsbehandling', () => {
  it('viser feilmelding om dato ikke settes, og verifiserer riktig kall til backend', async () => {
    render(
      <OpprettOppfølgingsBehandling
        sak={{
          behandlinger: [],
          ident: '',
          opprettetTidspunkt: '',
          periode: {
            fom: '',
            tom: '',
          },
          saksnummer: 'ABCDEFG',
          status: 'OPPRETTET',
          søknadErTrukket: undefined,
        }}
        brukerInformasjon={{ navn: 'Navn på bruker' }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Opprett oppfølgingsbehandling' }));

    expect(screen.getByText('Dato for oppfølging kan ikke må settes.')).toBeVisible();

    await user.type(screen.getByRole('textbox', { name: 'Dato for oppfølging' }), '13.02.2005');
    await user.click(screen.getByRole('combobox', { name: 'Hvem følger opp?' }));
    await user.click(screen.getByRole('option', { name: 'NAY' }));
    await user.click(screen.getByRole('button', { name: 'Opprett oppfølgingsbehandling' }));

    // Kaller `send` bare én gang
    expect(fetchMock.mock.calls).toHaveLength(1);
    const firstCall = fetchMock.mock.calls[0];

    const jsonBody = JSON.parse(String(firstCall[1]?.body));

    expect(jsonBody.melding.meldingType).toBe('OppfølgingsoppgaveV0');
    expect(jsonBody.melding.datoForOppfølging).toBe('2005-02-13');
    expect(jsonBody.melding.hvemSkalFølgeOpp).toBe('NasjonalEnhet');
  });
});