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
          ident: 'minident',
          opprettetTidspunkt: '',
          periode: {
            fom: '',
            tom: '',
          },
          saksnummer: 'ABCDEFG',
          status: 'OPPRETTET',
          søknadErTrukket: undefined,
        }}
        brukerInformasjon={{ navn: 'Navn på bruker', NAVident: 'minident' }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Opprett oppfølgingsbehandling' }));

    expect(screen.getByText('Dato for oppfølging kan ikke må settes.')).toBeVisible();

    // Prøver å sette dato i fortiden
    let datotekstboks = screen.getByRole('textbox', { name: 'Dato for oppfølging' });
    await user.type(datotekstboks, '13.02.2005');
    expect(screen.getByText('Datoen kan ikke være tilbake i tid.')).toBeVisible();

    // Fyll inn dato i framtiden
    await user.clear(datotekstboks);
    await user.type(datotekstboks, '13.02.2100');

    await user.click(screen.getByRole('combobox', { name: 'Hvem følger opp?' }));
    await user.click(screen.getByRole('option', { name: 'NAY' }));
    await user.click(screen.getByRole('button', { name: 'Opprett oppfølgingsbehandling' }));

    const checkbox = screen.getByRole('checkbox', { name: 'Reserver oppgaven til meg' });
    expect(checkbox).toBeChecked();

    // Kaller `send` bare én gang
    expect(fetchMock.mock.calls).toHaveLength(1);
    const firstCall = fetchMock.mock.calls[0];

    const jsonBody = JSON.parse(String(firstCall[1]?.body));

    expect(jsonBody.melding.meldingType).toBe('OppfølgingsoppgaveV0');
    expect(jsonBody.melding.datoForOppfølging).toBe('2100-02-13');
    expect(jsonBody.melding.hvemSkalFølgeOpp).toBe('NasjonalEnhet');
    expect(jsonBody.melding.reserverTilBruker).toBe('minident');

    fetchMock.resetMocks();
  });

  it('om boksen for oppfølging ikke er avkrysset, så sendes null med i hvemskalfølgeopp', async () => {
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
        brukerInformasjon={{ navn: 'Navn på bruker', NAVident: 'minident' }}
      />
    );

    let datotekstboks = screen.getByRole('textbox', { name: 'Dato for oppfølging' });

    // Fyll inn dato i framtiden
    await user.clear(datotekstboks);
    await user.type(datotekstboks, '13.02.2100');

    await user.click(screen.getByRole('combobox', { name: 'Hvem følger opp?' }));
    await user.click(screen.getByRole('option', { name: 'NAY' }));

    const checkbox = screen.getByRole('checkbox', { name: 'Reserver oppgaven til meg' });
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Opprett oppfølgingsbehandling' }));

    // Kaller `send` bare én gang
    expect(fetchMock.mock.calls).toHaveLength(1);
    const firstCall = fetchMock.mock.calls[0];

    const jsonBody = JSON.parse(String(firstCall[1]?.body));

    expect(jsonBody.melding.meldingType).toBe('OppfølgingsoppgaveV0');
    expect(jsonBody.melding.datoForOppfølging).toBe('2100-02-13');
    expect(jsonBody.melding.hvemSkalFølgeOpp).toBe('NasjonalEnhet');
    expect(jsonBody.melding.reserverTilBruker).toBeUndefined();
  });
});
