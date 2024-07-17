import { describe, test, expect, vi } from 'vitest';
import React, { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Filter } from 'components/oppgavebehandling/oppgavekø/filter/Filter';
import { DEFAULT_KØ, Kø, KøContext } from 'components/oppgavebehandling/KøContext';

const user = userEvent.setup();

describe('Filter', () => {
  test('har overskrift på nivå 2', () => {
    render(<Filter />);
    expect(screen.getByRole('heading', { level: 2, name: 'Filter' })).toBeVisible();
  });

  test('har en knapp for å legge til filter', () => {
    render(<Filter />);
    expect(screen.getByRole('button', { name: 'Legg til filter' })).toBeVisible();
  });

  test('har en knapp for å gjøre søk', () => {
    render(<Filter />);
    expect(screen.getByRole('button', { name: 'Søk' })).toBeVisible();
  });

  test('filter man kan legge til er skjult som standard', () => {
    render(<Filter />);
    expect(screen.queryByRole('button', { name: 'Innbygger' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Behandlingstype' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Oppgavetype' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Saksbehandler' })).not.toBeInTheDocument();
  });

  test('viser en popover med knapper når man klikker på "Legg til filter"', async () => {
    render(<Filter />);
    const leggTilFilterKnapp = screen.getByRole('button', { name: 'Legg til filter' });
    await user.click(leggTilFilterKnapp);
    expect(screen.getByRole('button', { name: 'Innbygger' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Behandlingstype' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Oppgavetype' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Saksbehandler' })).toBeVisible();
  });

  test('har ikke knapp for å slette kø når man står på DEFAULT_KØ', () => {
    køContextRender(<Filter />, { valgtKø: DEFAULT_KØ });
    expect(screen.queryByRole('button', { name: /Slett kø/ })).not.toBeInTheDocument();
  });

  test('viser knapp for å slette kø når man har valgt en kø annen enn DEFAULT_KØ og man er avdelingsleder', async () => {
    const nyKø: Kø = {
      id: 1,
      navn: 'En annen kø',
      beskrivelse: 'En helt annen kø',
    };
    køContextRender(<Filter erAvdelingsleder={true} />, { valgtKø: nyKø });
    expect(screen.getByRole('button', { name: /Slett kø/ })).toBeInTheDocument();
  });
});

test('viser knapp for å lagre kø når man har lagt til et filter og er avdelingsleder', () => {
  const nyKø: Kø = {
    id: 1,
    navn: 'En annen kø',
    beskrivelse: 'En helt annen kø',
    flervalgsfilter: [
      {
        navn: 'param',
        valgteFilter: [
          {
            value: '1',
            label: 'Label',
          },
        ],
        alleFilter: [
          {
            value: '1',
            label: 'Label',
          },
        ],
      },
    ],
  };
  køContextRender(<Filter erAvdelingsleder={true} />, { valgtKø: nyKø });
  expect(screen.getByRole('button', { name: /Lagre som kø/ })).toBeInTheDocument();
});

const køContextRender = (ui: ReactElement, { valgtKø, ...renderOptions }: { valgtKø: Kø }) => {
  const oppdaterValgtKø = vi.fn();
  const oppdaterValgtKøId = vi.fn();
  const oppdaterKøliste = vi.fn();
  const valgtKøId = 1;
  const køliste = [valgtKø];
  return render(
    <KøContext.Provider value={{ valgtKø, oppdaterValgtKø, valgtKøId, oppdaterValgtKøId, køliste, oppdaterKøliste }}>
      {ui}
    </KøContext.Provider>,
    renderOptions
  );
};
