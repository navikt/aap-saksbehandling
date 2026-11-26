'use client';

import { ReactNode, useState } from 'react';
import { KelvinAppHeader } from 'components/kelvinappheader/KelvinAppHeader';

export const KelvinAppHeaderWrapper = ({ children }: { children: ReactNode }) => {
  const [søkOverlay, setSøkOverlay] = useState(false);

  return (
    <>
      <KelvinAppHeader setSøkOverlay={setSøkOverlay} />
      <div inert={søkOverlay}>{children}</div>
    </>
  );
};
