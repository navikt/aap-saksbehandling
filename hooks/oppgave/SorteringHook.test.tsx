import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSortertListe } from 'hooks/oppgave/SorteringHook';
import { Oppgave } from 'lib/types/types';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';
import { ReactNode } from 'react';

describe('SorteringHook', () => {
  const mockBruker = { navn: 'Test Bruker', NAVident: 'Z123456' };
  const scope = 'test';

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <InnloggetBrukerContextProvider bruker={mockBruker}>{children}</InnloggetBrukerContextProvider>
  );

  const oppgaver: Pick<Oppgave, 'behandlingOpprettet' | 'id' | 'reservertAvNavn'>[] = [
    {
      behandlingOpprettet: '2025-10-27T09:44:54.793',
      id: 3,
      reservertAvNavn: 'Øyvind Gøyvind',
    },
    {
      behandlingOpprettet: '2025-10-28T09:47:35.504',
      id: 1,
      reservertAvNavn: 'Arild Barild',
    },
    {
      behandlingOpprettet: '2025-10-01T15:14:57.562',
      id: 2,
      reservertAvNavn: 'Åse Flåse',
    },
  ];

  test('skal sortere navn alfabetisk i stigende og synkende rekkefølge', () => {
    const { result } = renderHook(() => useSortertListe(oppgaver, scope), { wrapper });

    act(() => {
      result.current.settSorteringskriterier('reservertAvNavn');
    });
    const sorterteNavnStigende = result.current.sortertListe.map((oppgave) => oppgave.reservertAvNavn);
    expect(sorterteNavnStigende).toEqual(['Arild Barild', 'Øyvind Gøyvind', 'Åse Flåse']);

    act(() => {
      result.current.settSorteringskriterier('reservertAvNavn');
    });
    const sorterteNavnSynkende = result.current.sortertListe.map((oppgave) => oppgave.reservertAvNavn);
    expect(sorterteNavnSynkende).toEqual(['Åse Flåse', 'Øyvind Gøyvind', 'Arild Barild']);
  });

  test('skal sortere datoer i stigende og synkende rekkefølge', () => {
    const { result } = renderHook(() => useSortertListe(oppgaver, scope), { wrapper });

    act(() => {
      result.current.settSorteringskriterier('behandlingOpprettet');
    });
    const sorterteDatoerStigende = result.current.sortertListe.map((oppgave) => oppgave.behandlingOpprettet);
    expect(sorterteDatoerStigende).toEqual([
      '2025-10-01T15:14:57.562',
      '2025-10-27T09:44:54.793',
      '2025-10-28T09:47:35.504',
    ]);

    act(() => {
      result.current.settSorteringskriterier('behandlingOpprettet');
    });
    const sorterteDatoerSynkende = result.current.sortertListe.map((oppgave) => oppgave.behandlingOpprettet);
    expect(sorterteDatoerSynkende).toEqual([
      '2025-10-28T09:47:35.504',
      '2025-10-27T09:44:54.793',
      '2025-10-01T15:14:57.562',
    ]);
  });

  test('skal sortere ider (number) i stigende og synkende rekkefølge', () => {
    const { result } = renderHook(() => useSortertListe(oppgaver, scope), { wrapper });

    act(() => {
      result.current.settSorteringskriterier('id');
    });
    const sorterteIderStigende = result.current.sortertListe.map((oppgave) => oppgave.id);
    expect(sorterteIderStigende).toEqual([3, 2, 1]);

    act(() => {
      result.current.settSorteringskriterier('id');
    });
    const sorterteIderSynkende = result.current.sortertListe.map((oppgave) => oppgave.id);
    expect(sorterteIderSynkende).toEqual([1, 2, 3]);
  });

  test('skal lagre sorteringstilstand i localStorage og laste den ved initialisering', () => {
    // Sette sortering ved første render
    const { result: result1, unmount } = renderHook(() => useSortertListe(oppgaver, scope), { wrapper });

    act(() => {
      result1.current.settSorteringskriterier('reservertAvNavn');
    });

    expect(result1.current.sort).toEqual({
      orderBy: 'reservertAvNavn',
      direction: 'ascending',
    });

    // Sjekke at sorteringstilstanden er lagret i localStorage
    const storedValue = localStorage.getItem('OPPGAVE_SORTERING:TEST');
    expect(storedValue).toBeTruthy();
    expect(JSON.parse(storedValue!)).toEqual({
      sortState: {
        orderBy: 'reservertAvNavn',
        direction: 'ascending',
      },
      user: mockBruker.NAVident,
    });

    // Fjerne hook for å simulere at brukeren forlater siden
    unmount();

    // Ny render for å sjekke at sorteringstilstanden lastes fra localStorage
    const { result: result2 } = renderHook(() => useSortertListe(oppgaver, scope), { wrapper });

    expect(result2.current.sort).toEqual({
      orderBy: 'reservertAvNavn',
      direction: 'ascending',
    });

    const sorterteNavn = result2.current.sortertListe.map((oppgave) => oppgave.reservertAvNavn);
    expect(sorterteNavn).toEqual(['Arild Barild', 'Øyvind Gøyvind', 'Åse Flåse']);
  });

  test('skal isolere sorteringstilstand per bruker', () => {
    const bruker1 = { navn: 'Bruker 1', NAVident: 'Z111111' };
    const bruker2 = { navn: 'Bruker 2', NAVident: 'Z222222' };

    const wrapper1 = ({ children }: { children: ReactNode }) => (
      <InnloggetBrukerContextProvider bruker={bruker1}>{children}</InnloggetBrukerContextProvider>
    );

    const wrapper2 = ({ children }: { children: ReactNode }) => (
      <InnloggetBrukerContextProvider bruker={bruker2}>{children}</InnloggetBrukerContextProvider>
    );

    // Saksbehandler 1 setter sortering
    const { result: result1, unmount } = renderHook(() => useSortertListe(oppgaver, scope), {
      wrapper: wrapper1,
    });

    act(() => {
      result1.current.settSorteringskriterier('reservertAvNavn');
    });

    expect(result1.current.sort?.orderBy).toBe('reservertAvNavn');

    // Sjekk at saksbehandler 1 sin sorteringstilstand er lagret i localStorage
    expect(localStorage.getItem('OPPGAVE_SORTERING:TEST')).toBeTruthy();

    unmount();

    // Saksbehandler 2 kobler på og skal ikke ha noen sorteringstilstand siden det er en annen bruker
    const { result: result2 } = renderHook(() => useSortertListe(oppgaver, scope), { wrapper: wrapper2 });

    expect(result2.current.sort).toBeUndefined();

    // Elementet skal nå være fjernet fra localStorage siden det tilhørte en annen bruker
    expect(localStorage.getItem('OPPGAVE_SORTERING:TEST')).toBeNull();
  });

  test('skal isolere sorteringstilstand for ulike faner (mine-oppgaver, alle-oppgaver, osv)', () => {
    const { result: result1 } = renderHook(() => useSortertListe(oppgaver, 'mine-oppgaver'), { wrapper });
    const { result: result2 } = renderHook(() => useSortertListe(oppgaver, 'ledige-oppgaver'), { wrapper });

    act(() => {
      result1.current.settSorteringskriterier('reservertAvNavn');
    });

    expect(result1.current.sort).toEqual({ orderBy: 'reservertAvNavn', direction: 'ascending' });
    expect(result2.current.sort).toBeUndefined();

    act(() => {
      result2.current.settSorteringskriterier('id');
    });

    expect(result1.current.sort).toEqual({ orderBy: 'reservertAvNavn', direction: 'ascending' });
    expect(result2.current.sort).toEqual({ orderBy: 'id', direction: 'ascending' });

    expect(localStorage.getItem('OPPGAVE_SORTERING:MINE-OPPGAVER')).toBeTruthy();
    expect(localStorage.getItem('OPPGAVE_SORTERING:LEDIGE-OPPGAVER')).toBeTruthy();
  });
});
