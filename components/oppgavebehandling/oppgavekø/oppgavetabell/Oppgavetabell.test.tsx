import { Oppgavetabell } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell';
import { fordeltOppgave, mockOppgaver, ufordeltOppgave } from 'mocks/mockOppgaver';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mutateMock = jest.fn();
const user = userEvent.setup();

describe('Oppgavetabell', () => {
  test('har en tabellheader', () => {
    render(<Oppgavetabell oppgaver={mockOppgaver.oppgaver} mutate={mutateMock} />);
    expect(screen.getByRole('columnheader', { name: 'Innbygger' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Behandlingstype' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Oppgavetype' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Behandling opprettet' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Avklaringsbehov opprettet' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Saksbehandler' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: '' })).toBeVisible();
  });

  test('viser melding om ingen oppgaver når listen er tom', () => {
    render(<Oppgavetabell oppgaver={[]} mutate={mutateMock} />);
    expect(screen.getByText('Fant ingen oppgaver')).toBeVisible();
  });

  test('viser "ufordelt" for en oppgave som ikke har en saksbehandler', () => {
    render(<Oppgavetabell oppgaver={ufordeltOppgave} mutate={mutateMock} />);
    expect(screen.getByRole('cell', { name: 'Ufordelt' })).toBeVisible();
  });

  test('viser navn på saksbehandler når en oppgave er fordelt', () => {
    render(<Oppgavetabell oppgaver={fordeltOppgave} mutate={mutateMock} />);
    expect(screen.getByRole('cell', { name: fordeltOppgave[0].tilordnetRessurs })).toBeVisible();
  });

  test('har knapp for å ta en ufordelt oppgave', () => {
    render(<Oppgavetabell oppgaver={ufordeltOppgave} mutate={mutateMock} />);
    expect(screen.getByRole('button', { name: 'Behandle' })).toBeVisible();
  });

  test('tegner en rad pr oppgave', () => {
    render(<Oppgavetabell oppgaver={mockOppgaver.oppgaver} mutate={mutateMock} />);
    // row tar og med header-rad, legger derfor til en på forventet lengde
    expect(screen.getAllByRole('row')).toHaveLength(mockOppgaver.oppgaver.length + 1);
  });

  test('har en egen knapp for handlinger på en sak', () => {
    render(<Oppgavetabell oppgaver={fordeltOppgave} mutate={mutateMock} />);
    expect(screen.getByRole('button', { name: 'Handlinger' })).toBeVisible();
  });

  test('viser en meny når man klikker på Handlinger-knappen', async () => {
    render(<Oppgavetabell oppgaver={fordeltOppgave} mutate={mutateMock} />);
    await user.click(screen.getByRole('button', { name: 'Handlinger' }));
    expect(screen.getByRole('link', { name: 'Se sak' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Tildelt annen behandler' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Frigjør oppgave' })).toBeVisible();
  });
});
