import { SortState } from '@navikt/ds-react';
import { useState } from 'react';

export interface ScopedSortState<T> extends SortState {
  orderBy: Extract<keyof T, string>;
}

function comparator<T>(a: T, b: T, orderBy: keyof T): number {
  const aValue = a[orderBy];
  const bValue = b[orderBy];

  if (bValue == null || bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

export function useSortertListe<T>(elementer: T[]): {
  sort: ScopedSortState<T> | undefined;
  sortertListe: T[];
  håndterSortering: (sortKey: ScopedSortState<T>['orderBy']) => void;
} {
  const [sort, setSort] = useState<ScopedSortState<T> | undefined>();

  function håndterSortering(sortKey: ScopedSortState<T>['orderBy']) {
    const sortering =
      sort && sortKey === sort.orderBy && sort.direction === 'descending'
        ? undefined
        : {
            orderBy: sortKey,
            direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
          };

    setSort(sortering as ScopedSortState<T>);
  }

  const sorterteElementer = [...elementer].sort((a, b) => {
    if (sort) {
      return sort.direction === 'ascending' ? comparator(b, a, sort.orderBy) : comparator(a, b, sort.orderBy);
    }
    return 1;
  });

  return { sort, sortertListe: sorterteElementer, håndterSortering };
}
