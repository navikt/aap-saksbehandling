import { SortState } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useInnloggetBruker } from 'hooks/BrukerHook';

export interface ScopedSortState<T> extends SortState {
  orderBy: Extract<keyof T, string>;
}

interface StoredSortState<T> {
  sortState: ScopedSortState<T>;
  user: string;
}

function comparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] == null || b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function sortStorageKey(scope: string): string {
  return `OPPGAVE_SORTERING:${scope.toUpperCase()}`;
}

function hentSortering<T>(navIdent: string | undefined, scope: string): ScopedSortState<T> | undefined {
  if (typeof window === 'undefined' || !navIdent) return undefined;

  try {
    const lagretState = localStorage.getItem(sortStorageKey(scope));
    if (lagretState) {
      const data: StoredSortState<T> = JSON.parse(lagretState);
      if (data.user === navIdent) {
        return data.sortState;
      }
      localStorage.removeItem(sortStorageKey(scope));
    }
  } catch (error) {
    console.error('Kunne ikke hente sortering fra localStorage:', error);
  }
  return undefined;
}

function lagreSortering<T>(
  navIdent: string | undefined,
  sortState: ScopedSortState<T> | undefined,
  scope: string
): void {
  if (typeof window === 'undefined' || !navIdent) return;

  try {
    if (sortState) {
      const data: StoredSortState<T> = { sortState, user: navIdent };
      localStorage.setItem(sortStorageKey(scope), JSON.stringify(data));
    } else {
      localStorage.removeItem(sortStorageKey(scope));
    }
  } catch (error) {
    console.error('Kunne ikke lagre sortering i localStorage:', error);
  }
}

export function useSortertListe<T>(
  elementer: T[],
  scope: string
): {
  sort: ScopedSortState<T> | undefined;
  sortertListe: T[];
  settSorteringskriterier: (sortKey: ScopedSortState<T>['orderBy']) => void;
} {
  const bruker = useInnloggetBruker();
  const [sort, setSort] = useState<ScopedSortState<T> | undefined>(() => hentSortering<T>(bruker?.NAVident, scope));

  useEffect(() => {
    lagreSortering(bruker?.NAVident, sort, scope);
  }, [sort, bruker?.NAVident]);

  function settSorteringskriterier(sortKey: ScopedSortState<T>['orderBy']) {
    const sortering =
      sort && sortKey === sort.orderBy && sort.direction === 'descending'
        ? undefined
        : {
            orderBy: sortKey,
            direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
          };

    setSort(sortering as ScopedSortState<T>);
  }

  function utførSortering(elementer: T[]) {
    if (!sort) return elementer;

    return elementer.sort((a, b) => {
      if (typeof a[sort.orderBy] === 'string' && typeof b[sort.orderBy] === 'string') {
        const valueA = a[sort.orderBy] as string;
        const valueB = b[sort.orderBy] as string;
        return sort.direction === 'ascending' ? valueA.localeCompare(valueB, 'no') : valueB.localeCompare(valueA, 'no');
      }

      return sort.direction === 'ascending' ? comparator(a, b, sort.orderBy) : comparator(b, a, sort.orderBy);
    });
  }

  const sortertListe = utførSortering(elementer);

  return { sort, sortertListe, settSorteringskriterier: settSorteringskriterier };
}
