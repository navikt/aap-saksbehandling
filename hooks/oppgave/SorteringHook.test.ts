import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSortertListe } from 'hooks/oppgave/SorteringHook';
import { Oppgave } from 'lib/types/types';

describe('SorteringHook', () => {
  const oppgaver: Pick<Oppgave, 'behandlingOpprettet' | 'id' | 'reservertAvNavn'>[] = [
    {
      behandlingOpprettet: '2025-10-27T09:44:54.793',
      id: 3,
      reservertAvNavn: 'Øystein Hansen',
    },
    {
      behandlingOpprettet: '2025-10-28T09:47:35.504',
      id: 1,
      reservertAvNavn: 'Knut Pedersen',
    },
    {
      behandlingOpprettet: '2025-10-01T15:14:57.562',
      id: 2,
      reservertAvNavn: 'Åse Jensen',
    },
  ];

  test('skal sortere navn alfabetisk i stigende og synkende rekkefølge', () => {
    const { result } = renderHook(() => useSortertListe(oppgaver));

    act(() => {
      result.current.settSorteringskriterier('reservertAvNavn');
    });
    const sorterteNavnStigende = result.current.sortertListe.map((oppgave) => oppgave.reservertAvNavn);
    expect(sorterteNavnStigende).toEqual(['Knut Pedersen', 'Øystein Hansen', 'Åse Jensen']);

    act(() => {
      result.current.settSorteringskriterier('reservertAvNavn');
    });
    const sorterteNavnSynkende = result.current.sortertListe.map((oppgave) => oppgave.reservertAvNavn);
    expect(sorterteNavnSynkende).toEqual(['Åse Jensen', 'Øystein Hansen', 'Knut Pedersen']);
  });

  test('skal sortere datoer i stigende og synkende rekkefølge', () => {
    const { result } = renderHook(() => useSortertListe(oppgaver));

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
    const { result } = renderHook(() => useSortertListe(oppgaver));

    act(() => {
      result.current.settSorteringskriterier('id');
    });
    const sorterteIderSynkende = result.current.sortertListe.map((oppgave) => oppgave.id);
    expect(sorterteIderSynkende).toEqual([3, 2, 1]);

    act(() => {
      result.current.settSorteringskriterier('id');
    });
    const sorterteIderStigende = result.current.sortertListe.map((oppgave) => oppgave.id);
    expect(sorterteIderStigende).toEqual([1, 2, 3]);
  });
});
