'use client';

import { Brevbygger } from '@navikt/aap-breveditor/';
import { mellomlagreBrev } from 'lib/clientApi';
import { Brev } from 'lib/types/types';

import NavLogo from 'public/nav_logo.png';
import { useState } from 'react';

export const SkriveBrev = ({ referanse, grunnlag }: { referanse: string; grunnlag: Brev }) => {
  const [brev, setBrev] = useState<Brev>(grunnlag);

  /*const debauncedMellomlagring = useMemo(() => {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    return () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => mellomlagreBackendRequest, 2000);
    };
  }, [mellomlagreBackendRequest]);*/

  const mellomlagreBackendRequest = async (referanse: string, brev: Brev) => {
    console.log('mellomlagring mot backend', brev);
    const res = await mellomlagreBrev(referanse, brev);
    return res;
  };

  const onChange = (brev: Brev) => {
    setBrev(brev);
    mellomlagreBackendRequest(referanse, brev);
  };

  return <Brevbygger brevmal={brev} onBrevChange={onChange} logo={NavLogo} />;
};
