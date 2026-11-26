'use client';

import { ReactNode, useState } from 'react';
import { KelvinAppHeader } from 'components/kelvinappheader/KelvinAppHeader';
import { useFeatureFlag } from 'context/UnleashContext';

export const KelvinAppHeaderWrapper = ({ children }: { children: ReactNode }) => {
  const [søkOverlay, setSøkOverlay] = useState(false);
  const visSøkOverlay = useFeatureFlag('SokOverlayFrontend');

  return (
    <>
      <KelvinAppHeader setSøkOverlay={setSøkOverlay} />
      {visSøkOverlay ? <div inert={søkOverlay}>{children}</div> : children}
    </>
  );
};
