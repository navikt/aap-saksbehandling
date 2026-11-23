'use client';

import { ReactNode, useState } from 'react';
import { KelvinAppHeader } from 'components/kelvinappheader/KelvinAppHeader';
import { useFeatureFlag } from 'context/UnleashContext';
import styles from './KelvinAppHeader.module.css';

export const KelvinAppHeaderWrapper = ({ children }: { children: ReactNode }) => {
  const [søkOverlay, setSøkOverlay] = useState(false);
  const visSøkOverlay = useFeatureFlag('SokOverlayFrontend');

  return (
    <>
      <KelvinAppHeader setSøkOverlay={setSøkOverlay} />
      {visSøkOverlay ? (
        <>
          {søkOverlay && <div className={styles.søkOverlay} aria-hidden="true" data-testid="search-backdrop" />}
          <div className={styles.childrenWrapper} inert={søkOverlay}>
            {children}
          </div>
        </>
      ) : (
        children
      )}
    </>
  );
};
