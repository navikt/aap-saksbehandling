import { SortState } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

export interface ScopedSortState<T> extends SortState {
  orderBy: Extract<keyof T, string>;
}

export function useBackendSortering<T>(): {
  sort: ScopedSortState<T> | undefined;
  setSort: (orderBy: Extract<keyof T, string>) => void;
} {
  const [sort, setSort] = useState<ScopedSortState<T> | undefined>();

  function settSortering(sortKey: ScopedSortState<T>['orderBy']) {
    console.log('sortering', sort?.orderBy, sort?.direction);
    const sortering =
      sort && sortKey === sort.orderBy && sort.direction === 'descending'
        ? undefined
        : {
            orderBy: sortKey,
            direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
          };
    console.log('ny sortering', sortering?.orderBy, sortering?.direction);

    setSort(sortering as ScopedSortState<T>);
  }

  return { sort, setSort: settSortering };
}
