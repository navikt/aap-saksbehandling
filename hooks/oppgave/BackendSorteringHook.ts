import { SortState } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useInnloggetBruker } from 'hooks/BrukerHook';

export interface ScopedBackendSortState<T> {
  orderBy: T;
  direction: SortState['direction'];
}
interface StoredSortState<T> {
  sortState: ScopedBackendSortState<T>;
  user: string;
}

export function useBackendSortering<T>(scope: string): {
  sort: ScopedBackendSortState<T> | undefined;
  setSort: (orderBy: T) => void;
} {
  const bruker = useInnloggetBruker();
  const [sort, setSort] = useState<ScopedBackendSortState<T> | undefined>(() =>
    hentSortering<T>(bruker?.NAVident, scope)
  );

  useEffect(() => {
    lagreSortering(bruker?.NAVident, sort, scope);
  }, [sort, bruker?.NAVident]);

  function settSortering(sortKey: ScopedBackendSortState<T>['orderBy']) {
    const sortering =
      sort && sortKey === sort.orderBy && sort.direction === 'descending'
        ? undefined
        : {
            orderBy: sortKey,
            direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
          };

    setSort(sortering as ScopedBackendSortState<T>);
  }

  return { sort, setSort: settSortering };
}
function sortStorageKey(scope: string): string {
  return `OPPGAVE_SORTERING:${scope.toUpperCase()}`;
}

function hentSortering<T>(navIdent: string | undefined, scope: string): ScopedBackendSortState<T> | undefined {
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
  sortState: ScopedBackendSortState<T> | undefined,
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
