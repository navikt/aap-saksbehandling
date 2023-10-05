'use client';

import { Skeleton } from '@navikt/ds-react';
import styles from 'components/stegsuspense/StegSuspense.module.css';
import { ReactNode, Suspense } from 'react';

interface Props {
  children: ReactNode;
}
export const StegSuspense = ({ children }: Props) => (
  <Suspense
    fallback={
      <div>
        <Skeleton width={'100%'} height={56} variant={'rectangle'} className={styles.skeletonHeader} />
        <Skeleton width={'100%'} height={180} variant={'rectangle'} className={styles.skeletonBody} />
      </div>
    }
  >
    {children}
  </Suspense>
);
