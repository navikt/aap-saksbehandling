import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BehandleNesteOppgave } from 'components/oppgavebehandling/behandlenesteoppgave/BehandleNesteOppgave';

describe('BehandleNesteOppgave', () => {
  test('viser en knapp for å hente neste oppgave', () => {
    render(<BehandleNesteOppgave />);
    expect(screen.getByRole('button', { name: 'Behandle neste oppgave' })).toBeVisible();
  });
});
