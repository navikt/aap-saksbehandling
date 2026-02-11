import { SortState } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

export interface ScopedBackendSortState<T> {
  orderBy: T;
  direction: SortState['direction'];
}

export function useBackendSortering<T>(): {
  sort: ScopedBackendSortState<T> | undefined;
  setSort: (orderBy: T) => void;
} {
  const [sort, setSort] = useState<ScopedBackendSortState<T> | undefined>();

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
