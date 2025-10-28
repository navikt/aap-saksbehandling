import { SortState } from '@navikt/ds-react';
import { useState } from 'react';

export interface ScopedSortState<T> extends SortState {
  orderBy: Extract<keyof T, string>;
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

export function useSortertListe<T>(elementer: T[]): {
  sort: ScopedSortState<T> | undefined;
  sortertListe: T[];
  settSorteringskriterier: (sortKey: ScopedSortState<T>['orderBy']) => void;
} {
  const [sort, setSort] = useState<ScopedSortState<T> | undefined>();

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

    const sorterteElementer = elementer.sort((a, b) => {
      if (typeof a[sort.orderBy] === 'string' && typeof b[sort.orderBy] === 'string') {
        const valueA = a[sort.orderBy] as string;
        const valueB = b[sort.orderBy] as string;
        return sort.direction === 'ascending' ? valueA.localeCompare(valueB, 'no') : valueB.localeCompare(valueA, 'no');
      }

      return sort.direction === 'ascending' ? comparator(a, b, sort.orderBy) : comparator(b, a, sort.orderBy);
    });

    return sorterteElementer;
  }

  const sortertListe = utførSortering(elementer);

  return { sort, sortertListe, settSorteringskriterier: settSorteringskriterier };
}
