'use client';

import { Skeleton } from '@navikt/ds-react';
import { ReactNode, Suspense } from 'react';

interface Props {
  children: ReactNode;
}
export const StegSuspense = ({ children }: Props) => (
  <Suspense
    fallback={
      <div>
        <Skeleton width={'100%'} height={56} variant={'rectangle'} />
        <Skeleton width={'100%'} height={180} variant={'rectangle'} />
      </div>
    }
  >
    {children}
  </Suspense>
);
